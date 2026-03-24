import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PageWrapper = ({ children, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-50">
      <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isMobileMenuOpen={isSidebarOpen} 
        />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 pt-4">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
