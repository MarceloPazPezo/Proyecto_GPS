// Archivo: src/components/Layout.jsx lo hize con ia para que todo empiece despues de la Navbar y el fondo sea un SVG

import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Navbar from './Navbar'; 
import fondoSVG from '../assets/fondo_azul.svg'; 

const Layout = () => {
  return (
    
    <div 
      className="min-h-screen w-full bg-slate-500" // Un color de fondo base por si el SVG no carga
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
         backgroundColor: '#1e3046',
      }}
    >
      {/* 1. Renderizamos la Navbar aquí */}
      <Navbar />

      {/* 2. Este es el contenedor para el contenido de cada página */}
      <main className="pt-16"> 


        {/* 3. Outlet renderizará el componente de la ruta actual (Home, Users, etc.) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;