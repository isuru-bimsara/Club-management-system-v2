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


import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

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

  const handleSelectEvent = (event) => navigate(`/events/${event.id}`);

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
  );
};

export default EventCalendar;