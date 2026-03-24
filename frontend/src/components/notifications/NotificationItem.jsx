import React from 'react';
import { getRelativeTime } from '../../utils/formatDate';
import { Calendar, Ticket, Building2, Radio, CheckSquare, Bell } from 'lucide-react';
import Badge from '../ui/Badge';

const NotificationItem = ({ notification, onMarkRead }) => {
  const getIcon = () => {
    switch(notification.type) {
      case 'event': return <Calendar className="h-5 w-5" />;
      case 'ticket': return <Ticket className="h-5 w-5" />;
      case 'club': return <Building2 className="h-5 w-5" />;
      case 'broadcast': return <Radio className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getColorClass = () => {
    switch(notification.type) {
      case 'event': return 'bg-blue-100 text-blue-600';
      case 'ticket': return 'bg-green-100 text-green-600';
      case 'club': return 'bg-purple-100 text-purple-600';
      case 'broadcast': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-dark-100 text-dark-600';
    }
  };

  return (
    <div className={`card p-4 flex gap-4 transition-colors ${!notification.isRead ? 'border-primary-200 bg-primary-50/10' : ''}`}>
      <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${getColorClass()}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-dark-900' : 'font-semibold text-dark-800'}`}>
            {notification.title}
          </h4>
          <span className="text-xs text-dark-400 whitespace-nowrap ml-2">
            {getRelativeTime(notification.createdAt)}
          </span>
        </div>
        
        <p className={`text-sm ${!notification.isRead ? 'text-dark-700' : 'text-dark-500'}`}>
          {notification.message}
        </p>
        
        <div className="mt-3 flex items-center gap-2">
          <Badge status={notification.type === 'broadcast' ? 'ongoing' : ''}>
            {notification.type}
          </Badge>
          
          {!notification.isRead && onMarkRead && (
            <button
              onClick={() => onMarkRead(notification._id)}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 ml-auto"
            >
              <CheckSquare className="h-3 w-3" />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
