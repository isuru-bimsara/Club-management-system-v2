import React, { useEffect, useState } from 'react';
import eventService from '../../services/eventService';
import { formatDate } from '../../utils/formatDate';

const UpcomingEventsMarquee = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEvents({ status: 'upcoming', limit: 10 });
        setEvents(response.data);
      } catch (err) {
        console.error('Failed to fetch marquee events', err);
      }
    };
    fetchEvents();
  }, []);

  if (!events || events.length === 0) return null;

  return (
    <div className="hidden lg:flex w-full relative bg-white rounded-full border border-dark-100 px-2 py-1.5 items-center overflow-hidden shadow-sm">
      <div className="shrink-0 flex items-center gap-2 mr-4 z-10 bg-white px-3 border-r border-dark-100/60">
         <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100">
            <div className="h-2.5 w-2.5 rounded-full bg-primary-500"></div>
         </div>
         <span className="text-xs font-bold tracking-wide text-dark-800 pr-2">UPCOMING EVENTS</span>
      </div>
      
      <div className="flex-1 overflow-hidden whitespace-nowrap relative flex items-center">
        <div className="animate-marquee inline-block text-[13px]">
          {events.map((ev, index) => (
            <span key={ev._id} className="inline-flex items-center font-sans tracking-tight py-1">
              {ev.club?.logo && (
                 <img src={ev.club.logo} alt="Club" className="h-5 w-5 rounded object-cover mr-2" />
              )}
              {ev.club?.clubName && (
                <span className="font-black text-dark-900 uppercase text-[12px] tracking-wide mr-2 delimiter-none">
                  {ev.club.clubName}:
                </span>
              )}
              <span className="font-bold text-dark-900 whitespace-nowrap text-[13px] mr-5">{ev.title}</span> 
              
              <span className="flex items-center text-dark-500 mr-5 text-[12px] font-medium leading-none">
                <svg className="w-3.5 h-3.5 mr-1.5 text-dark-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                {ev.venue}
              </span>
              
              <span className="flex items-center text-dark-500 text-[12px] font-medium whitespace-nowrap leading-none">
                <svg className="w-3.5 h-3.5 mr-1.5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {formatDate(ev.date).split(',')[0]} at {ev.time}
              </span>
              
              {index < events.length - 1 && (
                 <span className="mx-8 flex items-center justify-center h-full">
                    <span className="h-1 w-1 rounded-full bg-dark-300"></span>
                 </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsMarquee;
