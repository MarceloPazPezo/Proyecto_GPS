import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@components/Sidebar';
import { AuthProvider } from '@context/AuthContext';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

  // --- CAMBIO CLAVE AQUÍ ---
  // Comprobamos si la ruta es /home o si COMIENZA CON /host/
  // Estas son las rutas que tendrán un layout especial (sin el contenedor principal).

  // Caso 1: La ruta es /home. Tiene su propio layout con Sidebar.
  if (location.pathname === '/home') {
    return (
      <div >
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={` transition-all duration-300 ${sidebarOpen ? 'ml-56' : ''}`}>
      <div>
        <Outlet />
      </div>
      </main>
      </div >
    );
  }

  // Caso 2: La ruta es para un host. No tiene NINGÚN layout, solo el contenido.
  if (location.pathname.startsWith('/host/')) {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  if (location.pathname === '/scoreBoard') {
    return (
      <div>

        <Outlet />
      </div>
    );
  }

  if (location.pathname.startsWith('/hostIdeas')) {
    return (
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Outlet />
      </div>
    );
  }

  // Si no es ninguna de las anteriores, usamos el layout por defecto con Sidebar y contenedor.
  return (
    <div className="min-h-screen w-full bg-[#efefef] flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`flex-1 flex items-center justify-center min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : ''}`}>
        <div className="w-full h-full flex items-center justify-center">
          <Outlet />
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