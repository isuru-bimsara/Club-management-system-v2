
const GOOGLE_CALENDAR_BASE_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE';

const pad = (value) => String(value).padStart(2, '0');

const formatGoogleDateTime = (value) => {
  const date = value instanceof Date ? value : new Date(value);

  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z',
  ].join('');
};

export const formatReminderLabel = (minutes = 30) => {
  if (minutes === 0) return 'At event time';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} before`;

  const hours = minutes / 60;
  if (Number.isInteger(hours) && hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} before`;
  }

  const days = minutes / 1440;
  if (Number.isInteger(days)) {
    return `${days} day${days === 1 ? '' : 's'} before`;
  }

  return `${minutes} minutes before`;
};

export const buildGoogleCalendarUrl = ({
  title,
  start,
  end,
  description,
  venue,
  reminderMinutes = 30,
}) => {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);
  const details = [description, `Suggested reminder: ${formatReminderLabel(reminderMinutes)}.`]
    .filter(Boolean)
    .join('\n\n');

  const params = new URLSearchParams({
    text: title || 'Event',
    dates: `${formatGoogleDateTime(startDate)}/${formatGoogleDateTime(endDate)}`,
    details,
    location: venue || '',
  });

  return `${GOOGLE_CALENDAR_BASE_URL}&${params.toString()}`;
};