import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';

// Un ícono de SVG para el menú hamburguesa, más limpio que los spans
const MenuIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// Un ícono de SVG para el botón de cerrar
const CloseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || {};
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    // Cierra el menú si se cambia de ruta (ej. usando los botones del navegador)
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Función para definir las clases del NavLink. Simplifica el código y es la forma moderna de hacerlo.
    const getNavLinkClass = ({ isActive }) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive 
            ? 'bg-white/20 text-white' 
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`;

    const getMobileNavLinkClass = ({ isActive }) => 
        `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            isActive 
            ? 'bg-sky-400/30 text-white' 
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`;

    const navLinks = (
      <>
        <NavLink to="/home" className={getNavLinkClass}>Inicio</NavLink>
        <NavLink to="/room" className={getNavLinkClass}>Actividades</NavLink>
        <NavLink to="/biblioteca" className={getNavLinkClass}>Biblioteca</NavLink>
        {userRole === 'administrador' && (
            <NavLink to="/users" className={getNavLinkClass}>Usuarios</NavLink>
        )}
      </>
    );

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo o Nombre de la App */}
                    <div className="flex-shrink-0">
                        <NavLink to="/home" className="text-white font-bold text-xl">
                            GPS App
                        </NavLink>
                    </div>

                    {/* Menú de Escritorio (se oculta en pantallas pequeñas) */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-4">
                        {navLinks}
                        <button 
                            onClick={logoutSubmit} 
                            className="text-slate-300 hover:bg-red-500/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Cerrar sesión
                        </button>
                    </div>

                    {/* Botón de Hamburguesa (se muestra en pantallas pequeñas) */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none">
                            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú Desplegable Móvil */}
            {menuOpen && (
                <div className="lg:hidden bg-white/5 backdrop-blur-lg border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {/* Reutilizamos los mismos links, pero con estilos móviles */}
                        <NavLink to="/home" className={getMobileNavLinkClass}>Inicio</NavLink>
                        <NavLink to="/room" className={getMobileNavLinkClass}>Actividades</NavLink>
                        {userRole === 'administrador' && (
                            <NavLink to="/users" className={getMobileNavLinkClass}>Usuarios</NavLink>
                        )}
                        <button 
                            onClick={logoutSubmit} 
                            className="w-full text-left text-slate-300 hover:bg-red-500/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;