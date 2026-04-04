export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

export const ROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  PRESIDENT: 'president',
  STUDENT: 'student'
};

export const TICKET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
};

export const BANK_DETAILS = {
  bankName: 'Commercial Bank of Ceylon',
  accountName: 'SLIIT Events Fund',
  accountNo: '1234567890',
  branch: 'Malabe'
};
