import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Building2, Clock } from 'lucide-react';
import eventService from '../../services/eventService';
import clubService from '../../services/clubService';
import Spinner from '../../components/ui/Spinner';
import EventCalendar from '../../components/ui/EventCalendar';
import { formatDate } from '../../utils/formatDate';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, clubsRes] = await Promise.all([
          eventService.getEvents({ limit: 4 }),
          clubService.getClubs({ limit: 4 })
        ]);
        
        setEvents(eventsRes.data);
        setClubs(clubsRes.data);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><Spinner size="lg" /></div>;
  }

  return (
    <div className="h-[calc(100vh-6rem)] min-h-[700px] w-full flex flex-col xl:grid xl:grid-cols-12 xl:grid-rows-[repeat(6,minmax(0,1fr))] gap-4 sm:gap-6 pt-1 pb-4">
      
      {/* 1. HERO BENTO (col 1-8, row 1-4) - LIGHT THEME */}
      <div className="xl:col-span-8 xl:row-span-4 card relative overflow-hidden bg-white group flex flex-col justify-end p-6 sm:p-10 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(15,61,48,0.06)] hover:-translate-y-1 cursor-pointer border border-primary-50">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-primary-50/40 to-[#f4f7f4]">
          {/* Background Photography Layer */}
          <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" alt="Campus Life" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000 ease-in-out" />
          
          {/* Overlaid Gradients to ensure crisp text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/50 to-transparent"></div>

          {/* Abstract blobs */}
          <div className="absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#bce35d]/20 blur-3xl group-hover:bg-[#bce35d]/30 transition-colors duration-700"></div>
          <div className="absolute -bottom-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-primary-200/30 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          
          {/* Dotted pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%230f3d30\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>
        
        <div className="relative z-10 w-full max-w-2xl">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/80 backdrop-blur-md text-primary-700 text-[10px] sm:text-xs font-bold tracking-widest mb-4 border border-primary-100 uppercase shadow-sm">
            Student Desktop
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-dark-900 leading-[1.05] mb-5 group-hover:translate-x-1 transition-transform duration-500">
            Own the <span className="text-primary-600 relative inline-block">Campus<div className="absolute -bottom-1 left-0 w-full h-3 sm:h-4 bg-[#bce35d]/40 -z-10 transform -skew-x-12"></div></span><br/>Experience.
          </h1>
          <p className="text-dark-600 text-sm sm:text-base leading-relaxed mb-8 line-clamp-2 max-w-xl font-medium">
            Discover cutting-edge student clubs, attend high-profile events, and maximize your SLIIT journey all from one flawlessly clean hub.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/events" className="btn bg-primary-900 text-white hover:bg-primary-800 border-transparent font-black px-6 sm:px-8 py-3.5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_8px_20px_rgb(15,61,48,0.2)] flex items-center gap-2 text-sm tracking-wide">
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Subtle decorative vector bottom right */}
        <div className="absolute right-0 bottom-0 h-64 w-64 opacity-[0.03] pointer-events-none transform translate-x-1/4 translate-y-1/4 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-700">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
             <path fill="#0f3d30" d="M47.7,-57.2C59.9,-46.8,66.8,-29.4,69.5,-11.5C72.2,6.4,70.7,24.8,61.9,40C53,55.2,36.8,67.2,18.4,72.4C-0.1,77.7,-20.9,76.2,-37.8,67A68.3,68.3,0,0,1,-62.4,41.4C-71.1,24.1,-75.4,5.9,-72.1,-11.1C-68.8,-28.1,-58,-43.8,-43.7,-53.9C-29.4,-64,-14.7,-68.6,1.4,-70.2C17.5,-71.8,35.4,-70.4,47.7,-57.2Z" transform="translate(100 100)" />
           </svg>
        </div>
      </div>

      {/* 2. CALENDAR BENTO (col 9-12, row 1-4) */}
      <div className="xl:col-span-4 xl:row-span-4 card flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] bg-white justify-center items-center border border-primary-50/50">
        <EventCalendar />
      </div>

      {/* 3. UPCOMING EVENTS BENTO (col 1-4, row 5-6) */}
      <div className="xl:col-span-4 xl:row-span-2 card bg-white flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 border border-primary-50/50">
        <div className="px-5 py-4 border-b border-dark-100/40 flex items-center justify-between bg-gradient-to-r from-primary-50/50 to-transparent">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-100 rounded-lg"><Calendar className="h-4 w-4 text-primary-700" /></div>
              <h2 className="font-extrabold text-dark-900 text-[13px] tracking-wide">UPCOMING</h2>
           </div>
           <Link to="/events" className="text-[10px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest flex items-center gap-1 group/link">
             View All <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
           </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
           {events.length > 0 ? (
             <div className="space-y-1">
               {events.map((ev) => (
                 <Link to={`/events/${ev._id}`} key={ev._id} className="block p-3 rounded-2xl hover:bg-dark-50/60 transition-colors group/item relative">
                    <h3 className="text-sm font-bold text-dark-900 group-hover/item:text-primary-600 line-clamp-1 mb-1 transition-colors">{ev.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-dark-500 font-medium tracking-tight">
                       <span className="flex items-center gap-1 drop-shadow-sm"><Calendar className="h-3 w-3 text-primary-400" /> {formatDate(ev.date).split(',')[0]}</span>
                       <span className="flex items-center gap-1 drop-shadow-sm"><Clock className="h-3 w-3 text-primary-400" /> {ev.time}</span>
                    </div>
                 </Link>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center p-4">
               <span className="text-dark-400 text-sm font-medium">No events upcoming.</span>
             </div>
           )}
        </div>
      </div>

      {/* 4. FEATURED CLUBS BENTO (col 5-8, row 5-6) */}
      <div className="xl:col-span-4 xl:row-span-2 card bg-white flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 border border-primary-50/50">
        <div className="px-5 py-4 border-b border-dark-100/40 flex items-center justify-between bg-gradient-to-r from-primary-50/50 to-transparent">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-100 rounded-lg"><Building2 className="h-4 w-4 text-primary-700" /></div>
              <h2 className="font-extrabold text-dark-900 text-[13px] tracking-wide">TOP CLUBS</h2>
           </div>
           <Link to="/clubs" className="text-[10px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest flex items-center gap-1 group/link">
             View All <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
           </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] grid grid-cols-2 gap-3 pb-4">
           {clubs.length > 0 ? (
             clubs.slice(0,4).map((club) => (
               <Link to={`/clubs/${club._id}`} key={club._id} className="block relative h-20 sm:h-[84px] rounded-2xl overflow-hidden group/club border border-primary-100 shadow-sm">
                  {club.coverPhoto || club.logo ? (
                    <img src={club.coverPhoto || club.logo} className="absolute inset-0 w-full h-full object-cover group-hover/club:scale-110 transition-transform duration-700" alt="" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                       <Building2 className="h-6 w-6 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/40 to-transparent opacity-80 group-hover/club:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                     <h3 className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 drop-shadow-md">{club.clubName}</h3>
                  </div>
               </Link>
             ))
           ) : (
             <div className="col-span-2 flex flex-col items-center justify-center h-full text-center p-4">
               <span className="text-dark-400 text-sm font-medium">No clubs found.</span>
             </div>
           )}
        </div>
      </div>

      {/* 5. QUICK ACTION BENTO (col 9-12, row 5-6) */}
      <Link to="/my-tickets" className="xl:col-span-4 xl:row-span-2 card overflow-hidden relative group flex flex-col justify-center p-6 sm:p-8 transition-all duration-400 hover:shadow-[0_12px_40px_rgb(188,227,93,0.3)] hover:-translate-y-1 bg-[#bce35d] border-none">
         <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%230f3d30\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')"}}></div>
         <div className="absolute right-0 top-0 w-40 h-40 bg-white/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 group-hover:bg-white/60 group-hover:scale-110 transition-all duration-700"></div>
         <span className="relative z-10 text-primary-900/70 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2">Ticketing Gateway</span>
         <h2 className="relative z-10 text-primary-900 text-2xl sm:text-3xl font-black tracking-tighter group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
            Tickets <ArrowRight className="h-6 w-6 text-primary-700 group-hover:translate-x-2 transition-transform" />
         </h2>
      </Link>

    </div>
  );
};

export default Home;
