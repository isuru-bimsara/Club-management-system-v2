import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Users, Calendar as CalendarIcon, LogIn, LogOut, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import clubService from '../../services/clubService';
import eventService from '../../services/eventService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EventCard from '../../components/events/EventCard';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  
  const isMember = user?.clubsJoined?.some(c => (c._id || c) === id);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const [clubRes, eventsRes] = await Promise.all([
          clubService.getClubById(id),
          eventService.getEvents({ clubId: id, limit: 3 })
        ]);
        
        setClub(clubRes);
        setEvents(eventsRes.data);
      } catch (error) {
        toast.error('Failed to load club details');
        navigate('/clubs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubData();
  }, [id, navigate]);

  const handleJoinLeave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsJoining(true);
    try {
      if (isMember) {
        await clubService.leaveClub(id);
        toast.success(`You have left ${club.clubName}`);
        
        // Update local user state
        const updatedClubs = user.clubsJoined.filter(c => (c._id || c) !== id);
        updateProfile({ clubsJoined: updatedClubs });
        
        setClub(prev => ({ ...prev, memberCount: prev.memberCount - 1 }));
      } else {
        await clubService.joinClub(id);
        toast.success(`You have confidently joined ${club.clubName}!`);
        
        // Update local user state
        const updatedClubs = [...(user.clubsJoined || []), id];
        updateProfile({ clubsJoined: updatedClubs });
        
        setClub(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!club) return null;

  return (
    <div className="pb-12">
      {/* Cover Photo */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl bg-dark-100 shadow-sm">
        {club.coverPhoto ? (
          <img src={club.coverPhoto} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-primary-600 to-primary-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/40 to-transparent"></div>
        
        <button 
          onClick={() => navigate('/clubs')}
          className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center sm:flex-row sm:items-end sm:space-x-8">
          {/* Logo */}
          <div className="relative -mt-16 sm:-mt-20 lg:-mt-24 z-10 h-32 w-32 sm:h-40 sm:w-40 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
            {club.logo ? (
              <img src={club.logo} alt={club.clubName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-50">
                <Building2 className="h-16 w-16 text-primary-300" />
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-0 flex w-full text-center sm:text-left flex-1 flex-col sm:flex-row sm:items-center sm:justify-between pb-2 sm:pb-4">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-3xl font-bold text-dark-900 sm:text-4xl">{club.clubName}</h1>
              <p className="text-sm font-medium text-dark-500 mt-1">Presided by {club.president?.name}</p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <Button 
                onClick={handleJoinLeave}
                isLoading={isJoining}
                variant={isMember ? 'secondary' : 'primary'}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {isMember ? <><LogOut className="h-4 w-4" /> Leave Club</> : <><LogIn className="h-4 w-4" /> Join Club</>}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dark-900 mb-4">About Us</h2>
              <div className="prose prose-dark max-w-none text-dark-600 whitespace-pre-wrap">
                {club.description}
              </div>
            </div>

            {events.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-900">Upcoming Events</h2>
                  <Button variant="secondary" onClick={() => navigate('/calendar')} className="text-xs !py-1.5 !px-3">
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {events.map(event => (
                    <EventCard key={event._id} event={event} showClubInfo={false} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-dark-400 mb-4">Club Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-500">Members</p>
                    <p className="text-xl font-bold text-dark-900">{club.memberCount || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-500">Events Hosted</p>
                    <p className="text-xl font-bold text-dark-900">{club.eventCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-primary-50 border border-primary-100">
              <h3 className="text-lg font-bold text-primary-900 mb-2">Want to learn more?</h3>
              <p className="text-sm text-primary-700 mb-4">
                Reach out to the club president or join to receive announcements directly to your inbox.
              </p>
              <a 
                href={`mailto:${club.president?.email}`}
                className="btn bg-white text-primary-600 hover:bg-dark-50 w-full shadow-sm"
              >
                Contact President
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
