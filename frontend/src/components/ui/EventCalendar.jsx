import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import eventService from '../../services/eventService';
import { buildGoogleCalendarUrl, formatReminderLabel } from '../../utils/googleCalendar';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays 
} from 'date-fns';

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEventsForCalendar();
        // Ensure start and end are date objects for easier comparison
        const formattedEvents = response.map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end)
        }));
        setEvents(formattedEvents || []);
      } catch (err) {
        console.error('Calendar failed to load events', err);
      }
    };
    fetchEvents();
  }, []);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onDateClick = day => setSelectedDate(day);

  // Render Header
  const header = () => {
    return (
      <div className="flex justify-between items-center mb-6 px-3 pt-2">
        <h2 className="text-[17px] font-bold tracking-tight text-dark-900">
          {format(currentDate, 'MMM yyyy, EEE')}
        </h2>
        <div className="flex space-x-1">
          <button onClick={prevMonth} className="p-1.5 rounded hover:bg-dark-50 transition-colors text-dark-400">
            <ChevronLeft className="h-4 w-4" strokeWidth={3} />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded hover:bg-dark-50 transition-colors text-dark-400">
            <ChevronRight className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  };

  // Render Days of Week
  const daysOfWeek = () => {
    const days = [];
    const startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
        days.push(
        <div className="text-center font-bold text-[10px] tracking-widest text-[#5c7cfa] pb-4 uppercase" key={i}>
          {format(addDays(startDate, i), 'EEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-1">{days}</div>;
  };

  // Render Calendar Grid
  const cells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const d = day;
        const formattedDate = format(d, dateFormat);
        const isCurrentMonth = isSameMonth(d, monthStart);
        const isSelected = isSameDay(d, selectedDate);
        const hasEvent = events.some(e => e.start && isSameDay(e.start, d));
        
        let wrapperClass = "w-10 h-10 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 mt-1 relative ";
        let innerClass = "w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-semibold transition-colors duration-200 ";

        if (!isCurrentMonth) {
          innerClass += "text-dark-300";
        } else if (isSelected) {
          wrapperClass += "bg-[#e5edff]"; 
          innerClass += "bg-[#5c7cfa] text-white shadow-md shadow-[#5c7cfa]/30"; 
        } else {
          innerClass += "text-dark-800 hover:bg-dark-50";
        }

        days.push(
          <div 
            className="w-full flex justify-center py-1" 
            key={d.toISOString()} 
            onClick={() => onDateClick(d)}
          >
            <div className={wrapperClass}>
              <div className={innerClass}>
                {formattedDate}
              </div>
              {/* Event Dot */}
              {hasEvent && !isSelected && (
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#5c7cfa]"></div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-y-1" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const selectedDayEvents = events.filter(e => e.start && isSameDay(e.start, selectedDate));

  return (
    <div className="card p-6 sm:p-8 bg-white rounded-[2.5rem] w-full shadow-[0_10px_40px_rgb(0,0,0,0.03)] border-transparent group">
      <div className="mb-2">
         {header()}
      </div>
      <div className="px-1">
         {daysOfWeek()}
         {cells()}
      </div>
      
      {/* Event Details Section */}
      <div className="mt-8 pt-6 border-t border-dark-100/40 px-3 flex flex-col items-center">
        {selectedDayEvents.length > 0 ? (
           <div className="w-full space-y-3">
              <h4 className="text-[10px] font-bold text-dark-400 uppercase tracking-widest mb-3">
                 Events on {format(selectedDate, "MMM d")}
              </h4>
              {selectedDayEvents.map(ev => (
                 <div key={ev.id} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#f8faff] border border-[#e5edff] hover:border-[#5c7cfa]/30 transition-colors cursor-pointer w-full">
                    <p className="text-[13px] font-bold text-dark-900 leading-tight">
                       {ev.title}
                    </p>
                    <div className="flex items-center gap-3">
                       <span className="flex items-center text-[10px] font-semibold text-dark-500">
                          <Clock className="w-3 h-3 mr-1 text-[#5c7cfa]" />
                          {ev.extendedProps?.time}
                       </span>
                       <span className="flex items-center text-[10px] font-semibold text-dark-500 truncate">
                          <MapPin className="w-3 h-3 mr-1 text-[#5c7cfa]" />
                          {ev.extendedProps?.venue}
                       </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="text-[10px] font-semibold text-dark-400">
                        Reminder: {formatReminderLabel(ev.extendedProps?.reminderMinutes ?? 30)}
                      </span>
                      <a
                        href={buildGoogleCalendarUrl({
                          title: ev.title,
                          start: ev.start,
                          end: ev.end,
                          description: ev.extendedProps?.description,
                          venue: ev.extendedProps?.venue,
                          reminderMinutes: ev.extendedProps?.reminderMinutes ?? 30,
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold uppercase tracking-wide text-[#5c7cfa] hover:text-[#4c6ef5]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Add to Google Calendar
                      </a>
                    </div>
                 </div>
              ))}
           </div>
        ) : (
           <div className="flex flex-col items-center text-center justify-center">
              <p className="text-xs text-dark-400 font-medium mb-1">
                 No events scheduled on {format(selectedDate, "MMM d")}
              </p>
              <div className="flex items-center gap-3 mt-4">
                 <div className="w-8 h-8 rounded-full bg-[#ff7eb6]/20 flex items-center justify-center shadow-sm">
                    <MapPin className="w-4 h-4 text-[#ff7eb6]" />
                 </div>
                 <div className="w-8 h-8 rounded-full bg-[#5c7cfa] flex items-center justify-center shadow-md shadow-[#5c7cfa]/30">
                    <Clock className="w-4 h-4 text-white" />
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
