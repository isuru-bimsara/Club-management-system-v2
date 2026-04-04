import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass = "text-primary-600 bg-primary-100", isPrimary = false }) => {
  if (isPrimary) {
    return (
      <div className="card p-5 sm:p-6 bg-primary-800 text-white relative overflow-hidden shadow-lg shadow-primary-900/20 border-none">
        <div className="flex flex-col h-full justify-between relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary-100 text-sm font-semibold">{title}</span>
            <div className="p-2 rounded-full bg-white/10 text-white">
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-end justify-between">
             <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white">{value}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6 border transparent">
      <div className="flex flex-col h-full justify-between">
         <div className="flex items-center justify-between mb-4">
           <span className="text-dark-500 text-sm font-semibold">{title}</span>
           <div className={`p-2 rounded-full ${colorClass}`}>
             <Icon className="h-4 w-4" />
           </div>
         </div>
         <div className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-dark-900">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
