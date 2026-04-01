import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', id, icon, ...props }, ref) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="label-text">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={`input-field ${error ? 'ring-red-500 focus:ring-red-500' : ''} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
