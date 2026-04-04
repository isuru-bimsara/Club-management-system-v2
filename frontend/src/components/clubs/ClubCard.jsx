import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar as CalendarIcon, Building2 } from 'lucide-react';

const ClubCard = ({ club }) => {
  return (
    <Link to={`/clubs/${club._id}`} className="block group">
      <div className="card h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
        <div className="h-32 w-full overflow-hidden bg-dark-100 relative">
          {club.coverPhoto ? (
            <img 
              src={club.coverPhoto} 
              alt={`${club.clubName} cover`} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-primary-400 to-primary-600">
               <Building2 className="h-12 w-12 text-white/50" />
            </div>
          )}
        </div>
        
        <div className="px-5 pb-5 pt-0 relative">
          <div className="-mt-10 mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-white shadow-sm relative z-10">
            {club.logo ? (
              <img src={club.logo} alt={club.clubName} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-8 w-8 text-primary-500" />
            )}
          </div>
          
          <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {club.clubName}
          </h3>
          
          <p className="mt-2 text-sm text-dark-500 line-clamp-2 min-h-10">
            {club.description}
          </p>
          
          <div className="mt-4 flex items-center justify-between border-t border-dark-100 pt-4 text-xs font-medium text-dark-500">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary-500" />
              <span>{club.memberCount || 0} Members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 text-primary-500" />
              <span>{club.eventCount || 0} Events</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClubCard;
