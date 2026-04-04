import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  className = '', 
  isLoading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'danger': return 'btn-danger';
      default: return 'btn-primary';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClasses()} ${className}`}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
