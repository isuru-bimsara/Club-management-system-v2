import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import { getRelativeTime } from '../../utils/formatDate';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications({ limit: 5 });
      setNotifications(res.data);
      setUnreadCount(res.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleMarkAsRead = async (id, type) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
      
      // Basic routing logic based on notification type
      if (type === 'ticket') {
        navigate('/my-tickets');
      } else if (type === 'event' || type === 'club' || type === 'broadcast') {
        // Just view Notifications page if more complex routing isn't needed right now
        // Or navigate to the specific event/club if we had the ID in the payload
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-dark-500 hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b border-dark-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-dark-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-dark-100">
                {notifications.map((notification) => (
                  <li 
                    key={notification._id}
                    className={`p-4 hover:bg-dark-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
                    onClick={() => handleMarkAsRead(notification._id, notification.type)}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${!notification.isRead ? 'bg-primary-500' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-dark-900' : 'font-medium text-dark-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-dark-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-dark-400 mt-1">
                          {getRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-dark-500">
                You have no notifications.
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-dark-100">
            <button
              onClick={handleViewAll}
              className="w-full text-center text-xs font-semibold text-primary-600 py-2 hover:bg-primary-50 rounded-md transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
