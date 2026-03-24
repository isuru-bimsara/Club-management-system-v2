import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8">
        <div className="glass-header flex items-center justify-between px-6 py-4">
          <h3 className="text-lg font-semibold text-dark-900">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-dark-400 hover:bg-dark-100 hover:text-dark-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
