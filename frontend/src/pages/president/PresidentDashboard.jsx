import React, { useEffect, useState } from 'react';
import { Calendar, Users, Ticket, Award } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import clubService from '../../services/clubService';
import ticketService from '../../services/ticketService';
import eventService from '../../services/eventService';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import EventCalendar from '../../components/ui/EventCalendar';

const PresidentDashboard = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [club, setClub] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    ticketsSold: 0,
    revenue: 0,
    pendingTickets: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch president's club or all clubs for admin
        const queryParams = (user.role === 'admin' || user.role === 'superadmin') ? { limit: 100 } : { presidentId: user?._id };
        const clubsRes = await clubService.getClubs(queryParams);
        if (clubsRes.data && clubsRes.data.length > 0) {
          setClubs(clubsRes.data);
          let myClub = clubsRes.data[0];
          if (clubId) {
             myClub = clubsRes.data.find(c => c._id === clubId) || myClub;
          } else {
             setClubId(myClub._id);
          }
          setClub(myClub);
          
          // Fetch events for this club
          const eventsRes = await eventService.getEvents({ clubId: myClub._id, limit: 100 });
          const myEvents = eventsRes.data;
          
          // Fetch tickets for this club
          const ticketsRes = await ticketService.getClubTickets(myClub._id, { limit: 1000 });
          const allTickets = ticketsRes.data;
          
          // Calculate stats
          const ticketsSold = myEvents.reduce((acc, ev) => acc + ev.ticketsSold, 0);
          const revenue = allTickets.filter(t => t.status === 'approved').reduce((acc, t) => acc + t.totalAmount, 0);
          const pendingTickets = allTickets.filter(t => t.status === 'pending').length;
          
          setStats({
            totalMembers: myClub.memberCount || 0,
            totalEvents: myClub.eventCount || 0,
            ticketsSold,
            revenue,
            pendingTickets
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, clubId]);

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!club) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <Award className="h-16 w-16 text-dark-300 mb-4" />
        <h2 className="text-xl font-bold text-dark-900">No Club Assigned</h2>
        <p className="mt-2 text-dark-500 max-w-md">
          You are registered as a President, but haven't been assigned to a club yet. 
          Please contact the system administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pl-1">
        <div>
          <p className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-2">President &middot; Dashboard</p>
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-dark-900 tracking-tight leading-tight">
            Welcome Back,<br/>
            {user?.name || 'President'}
          </h1>
          <div className="mt-4 flex items-center gap-2">
            <p className="text-sm font-medium text-dark-500">Currently viewing: <strong className="text-dark-800">{club.clubName}</strong></p>
            {(user.role === 'admin' || user.role === 'superadmin') && clubs.length > 0 && (
              <select
                className="ml-2 text-xs font-bold uppercase tracking-wider border-dark-200 rounded-lg bg-white py-1.5 px-3 text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                value={clubId || ''}
                onChange={(e) => setClubId(e.target.value)}
              >
                {clubs.map(c => (
                  <option key={c._id} value={c._id}>{c.clubName}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers} 
          icon={Users} 
          isPrimary={true}
        />
        <StatCard 
          title="Total Events" 
          value={stats.totalEvents} 
          icon={Calendar} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Tickets Sold" 
          value={stats.ticketsSold} 
          icon={Ticket} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.revenue)} 
          icon={Award} 
          colorClass="bg-yellow-100 text-yellow-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {stats.pendingTickets > 0 && (
            <div className="rounded-[2rem] border border-primary-200 bg-primary-50 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <Ticket className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-900">Pending Ticket Approvals</h3>
                  <p className="mt-1 text-sm text-dark-600">
                    You have {stats.pendingTickets} ticket request(s) waiting for approval.
                  </p>
                </div>
                <div className="ml-auto">
                  <a href="/president/tickets" className="btn btn-primary">
                    Review Now
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default PresidentDashboard;
