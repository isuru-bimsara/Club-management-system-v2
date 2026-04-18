import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import EventCalendar from '../../components/events/EventCalendar';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const parseLocalDateTime = (value) => {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0); // local midnight
  }
  return new Date(value);
};

const todayLabel = () => {
  const now = new Date();
  return now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await eventService.getEventsForCalendar();
        const calendarData = response
          .map((event) => {
            const start = parseLocalDateTime(event.start);
            const end = parseLocalDateTime(event.end || event.start);
            return { ...event, start, end, allDay: false };
          })
          .filter((e) => e.start instanceof Date && !isNaN(e.start));
        setEvents(calendarData);
      } catch (error) {
        toast.error('Failed to load calendar events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalendarEvents();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-dark-900">Events Calendar</h1>
        <p className="mt-1 text-dark-500 font-medium">Today: {todayLabel()}</p>
        <p className="text-dark-500 font-medium">Plan your schedule and see all upcoming university activities.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="flex-1 w-full bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-primary-50">
          {/* Removed overflow-hidden so the last row of days is visible */}
          <EventCalendar events={events} />
        </div>
      )}
    </div>
  );
};

export default CalendarView;