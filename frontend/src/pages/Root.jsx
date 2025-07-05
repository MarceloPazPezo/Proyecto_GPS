import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import { AuthProvider } from '@context/AuthContext';

// 1. Importa tu fondo SVG aquí, en la parte superior del archivo.
import fondoSVG from '../assets/fondo_azul.svg'; // Asegúrate de que la ruta sea correcta

// Este componente se mantiene igual. ¡Perfecto!
function Root()  {
  return (
    <AuthProvider>
      <PageRoot/>
    </AuthProvider>
  );
}

// Aquí es donde aplicamos el diseño.
function PageRoot() {
  return (
    // 2. Este es el contenedor principal que aplica el fondo a toda la aplicación.
    <div 
      className="min-h-screen w-full bg-slate-900" // Un color de fondo por si el SVG no carga
      style={{
        backgroundImage: `url(${fondoSVG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 3. Tu Navbar se renderiza aquí, como ya lo tenías. */}
      <Navbar />

      {/* 4. El <main> envuelve al <Outlet> y añade el padding superior. */}
      {/* pt-16 (padding-top: 4rem) empuja el contenido hacia abajo, evitando que quede tras la Navbar. */}
      <main className="pt-16">
        
        {/* Contenedor opcional para centrar y añadir espaciado lateral al contenido. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex min-h-[calc(100vh-4rem)] items-center justify-center">
          {/* 5. El Outlet renderizará aquí el contenido de la página actual (Home, Users, etc.). */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Root;