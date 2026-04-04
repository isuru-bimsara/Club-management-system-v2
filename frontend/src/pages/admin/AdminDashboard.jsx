//frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Building2, Users, Calendar, Banknote, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import adminService from '../../services/adminService';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import ClubTable from '../../components/clubs/ClubTable';
import EventCalendar from '../../components/ui/EventCalendar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminService.getReports();
        setData(response);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="mb-8 pl-1">
        <p className="text-sm font-bold text-dark-400 uppercase tracking-widest mb-2">Admin &middot; Dashboard</p>
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-dark-900 tracking-tight leading-tight">
          Welcome Back,<br/>
          {user?.name || 'Administrator'}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard 
          title="Total Clubs" 
          value={data?.summary?.totalClubs || 0} 
          icon={Building2} 
          isPrimary={true}
        />
        <StatCard 
          title="Registered Students" 
          value={data?.summary?.totalStudents || 0} 
          icon={Users} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Total Events" 
          value={data?.summary?.totalEvents || 0} 
          icon={Calendar} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(data?.summary?.totalRevenue || 0)} 
          icon={Banknote} 
          colorClass="bg-yellow-100 text-yellow-600" 
        />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-dark-900 mb-4">Quick Administration Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button onClick={() => navigate('/admin/tickets')} className="p-4 rounded-xl border border-dark-200 hover:border-primary-500 hover:bg-primary-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
            <Ticket className="h-6 w-6 text-primary-600" />
            <span className="text-sm font-medium text-dark-900">Ticket Approvals</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-dark-900 mb-4">Top Clubs by Membership</h2>
          {data?.topClubs?.length > 0 ? (
            <div className="space-y-4">
              {data.topClubs.map((club, index) => (
                <div key={club._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dark-100 text-sm font-bold text-dark-600">
                      {index + 1}
                    </div>
                    <span className="font-medium text-dark-900">{club.clubName}</span>
                  </div>
                  <span className="text-sm font-medium text-dark-600 bg-dark-50 px-3 py-1 rounded-full border border-dark-200">
                    {club.memberCount} members
                  </span>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-dark-500">No data available</p>
          )}
        </div>
        
        <div className="card p-6">
          <h2 className="text-lg font-bold text-dark-900 mb-4">Revenue by Club</h2>
          {data?.revenueByClub?.length > 0 ? (
            <div className="space-y-4">
              {data.revenueByClub.slice(0, 5).map((club, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-dark-900">{club._id}</span>
                  <span className="text-sm font-bold text-primary-600">
                    {formatCurrency(club.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-dark-500">No revenue data available</p>
          )}
        </div>

        <div className="h-full">
           <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
