import { Outlet } from 'react-router-dom';
import Sidebar from '@components/Sidebar';
import { AuthProvider } from '@context/AuthContext';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

function Root() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AuthProvider>
      <PageRoot sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </AuthProvider>
  );
}

function PageRoot({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
  if (location.pathname === '/home') {
    return (<div>
     <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <Outlet />
    </div>)

    
    
    ; // Home ocupa toda la pantalla
  }
  return (
    <div className="min-h-screen w-full bg-[#D8EFFD] flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`flex-1 flex items-center justify-center min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : ''}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-[#f7f7fb] w-full max-w-11/12 rounded-xl shadow p-9">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

PageRoot.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Root;