import React from 'react';

const Badge = ({ children, status }) => {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
      case 'banned':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      default:
        return 'bg-dark-100 text-dark-800 border-dark-200';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getColors()}`}>
      {children}
    </span>
  );
};

export default Badge;
