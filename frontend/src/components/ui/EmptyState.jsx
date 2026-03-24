import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dark-300 bg-white py-16 px-6 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dark-50 mb-4">
        {Icon ? <Icon className="h-8 w-8 text-dark-400" /> : null}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-dark-900">{title}</h3>
      <p className="mt-1 text-sm text-dark-500 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
