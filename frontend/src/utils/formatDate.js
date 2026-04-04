//frontend/src/utils/formatDate.js
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns';

export const formatDate = (dateString, formatStr = 'PPP') => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, formatStr) : '';
};

export const formatDateTime = (dateString, timeString) => {
  if (!dateString || !timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(dateString);
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    return format(date, 'PPP, p');
  } catch (error) {
    return '';
  }
};

export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '';
};
