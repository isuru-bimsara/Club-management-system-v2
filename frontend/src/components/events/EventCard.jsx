import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const EventCard = ({ event, showClubInfo = true }) => {
  const isSoldOut = event.ticketsSold >= event.totalTickets;

  return (
    <Link to={`/events/${event._id}`} className="block group h-full">
      <div className="card h-full flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-1">
        <div className="relative h-48 w-full overflow-hidden bg-dark-100">
          {event.bannerImage ? (
            <img 
              src={event.bannerImage} 
              alt={event.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
               <span className="text-white/30 font-bold text-2xl tracking-widest uppercase">{event.title.substring(0,2)}</span>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <Badge status={event.status}>{event.status}</Badge>
          </div>
          
          {isSoldOut && (
            <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-xl px-4 py-2 border-2 border-white rounded-md transform -rotate-12">SOLD OUT</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 p-5">
          {showClubInfo && event.club && (
            <div className="flex items-center gap-2 mb-3">
              {event.club.logo ? (
                <img src={event.club.logo} alt={event.club.clubName} className="h-6 w-6 rounded-md object-cover border border-dark-200" />
              ) : (
                <div className="h-6 w-6 border border-dark-200 rounded-md bg-dark-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold">{event.club.clubName?.charAt(0)}</span>
                </div>
              )}
              <span className="text-xs font-semibold text-primary-600">{event.club.clubName}</span>
            </div>
          )}
          
          <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
            {event.title}
          </h3>
          
          <div className="mt-4 space-y-2 text-sm text-dark-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-dark-400 shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-dark-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex flex-start gap-2">
              <MapPin className="h-4 w-4 text-dark-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>
          
          <div className="mt-5 flex items-center justify-between border-t border-dark-100 pt-4">
            <div className="font-bold text-lg text-dark-900">
              {event.ticketPrice > 0 ? formatCurrency(event.ticketPrice) : 'Free'}
            </div>
            <div className="text-xs font-medium text-dark-500">
              {event.totalTickets - event.ticketsSold} left
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
