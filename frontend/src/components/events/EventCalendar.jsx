// import React, { useState } from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import { format, parse, startOfWeek, getDay } from 'date-fns';
// import { enUS } from 'date-fns/locale/en-US';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { useNavigate } from 'react-router-dom';

// const locales = {
//   'en-US': enUS,
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const EventCalendar = ({ events }) => {
//   const navigate = useNavigate();

//   const handleSelectEvent = (event) => {
//     navigate(`/events/${event.id}`);
//   };

//   const eventStyleGetter = (event) => {
//     let backgroundColor = '#16a383'; // primary teal
    
//     // Can customize colors based on club or status
//     if (event.extendedProps?.status === 'completed') {
//       backgroundColor = '#94a3b8'; // tailwind slate-400
//     }

//     return {
//       style: {
//         backgroundColor,
//         borderRadius: '6px',
//         opacity: 0.9,
//         color: 'white',
//         border: '0px',
//         display: 'block',
//         fontSize: '12px',
//         padding: '2px 4px'
//       }
//     };
//   };

//   return (
//     <div className="h-full min-h-[700px] w-full">
//       <Calendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: '100%', minHeight: '700px' }}
//         onSelectEvent={handleSelectEvent}
//         eventPropGetter={eventStyleGetter}
//         views={['month', 'week', 'day']}
//         defaultView="month"
//         tooltipAccessor={(e) => `${e.title}\n${e.extendedProps?.clubName}\n${e.extendedProps?.venue}`}
//       />
//     </div>
//   );
// };

// export default EventCalendar;


import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { buildGoogleCalendarUrl, formatReminderLabel } from '../../utils/googleCalendar';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EventCalendar = ({ events }) => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectEvent = (event) => setSelectedEvent(event);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#16a383'; // primary teal
    if (event.extendedProps?.status === 'completed') backgroundColor = '#94a3b8';
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 4px',
      },
    };
  };

  return (
    <>
      <div className="w-full" style={{ height: '100%', minHeight: '700px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: '700px' }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          tooltipAccessor={(e) => `${e.title}\n${e.extendedProps?.clubName}\n${e.extendedProps?.venue}`}
        />
      </div>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event'}
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="space-y-2 text-sm text-dark-600">
              <p className="font-medium text-dark-900">
                {format(selectedEvent.start, 'EEEE, MMM d, yyyy')} at {selectedEvent.extendedProps?.time}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-800" />
                <span>{selectedEvent.extendedProps?.venue}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-800" />
                <span>Reminder: {formatReminderLabel(selectedEvent.extendedProps?.reminderMinutes ?? 30)}</span>
              </p>
              {selectedEvent.extendedProps?.description && (
                <p className="whitespace-pre-wrap text-dark-500">
                  {selectedEvent.extendedProps.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <a
                href={buildGoogleCalendarUrl({
                  title: selectedEvent.title,
                  start: selectedEvent.start,
                  end: selectedEvent.end,
                  description: selectedEvent.extendedProps?.description,
                  venue: selectedEvent.extendedProps?.venue,
                  reminderMinutes: selectedEvent.extendedProps?.reminderMinutes ?? 30,
                })}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Add to Google Calendar
              </a>
              <Button
                onClick={() => {
                  navigate(`/events/${selectedEvent.id}`);
                  setSelectedEvent(null);
                }}
              >
                View Event
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default EventCalendar;
