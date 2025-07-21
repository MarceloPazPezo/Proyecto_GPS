
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import { useAuth } from '@context/AuthContext';
import { FiMenu, FiX } from "react-icons/fi";
import { MdExpandMore, MdHome, MdLibraryBooks, MdGroup, MdSupervisorAccount, MdCollectionsBookmark, MdPeople } from "react-icons/md";
// Estado para el desplegable de Recursos Humanos

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const [openRRHH, setOpenRRHH] = React.useState(true);

    const navigate = useNavigate();
    const { user } = useAuth();
    const userRole = user?.rol;

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Clases de enlace, igual que en Navbar
    const getNavLinkClass = ({ isActive }) =>
        `block px-4 py-3 rounded-md font-semibold transition-colors duration-200 text-base ${isActive
            ? 'bg-[#4EB9FA]/60 text-[#2C3E50]'
            : 'text-[#2C3E50] hover:bg-[#4EB9FA]/30 hover:text-white'
        }`;

    const navLinks = [
        { to: "/home", label: "Inicio", icon: <MdHome size={20} className="mr-2" /> },
        { to: "/room", label: "Actividades", icon: <MdGroup size={20} className="mr-2" /> },
        { to: "/biblioteca", label: "Biblioteca", icon: <MdLibraryBooks size={20} className="mr-2" /> },
    ];

    // Estado local para controlar el retraso del botón hamburger
    const [showHamburger, setShowHamburger] = React.useState(false);

    React.useEffect(() => {
        let timeout;
        if (!sidebarOpen) {
            timeout = setTimeout(() => setShowHamburger(true), 150); // 350ms delay
        } else {
            setShowHamburger(false);
        }
        return () => clearTimeout(timeout);
    }, [sidebarOpen]);

    return (
        <>
            {/* Botón hamburger visible con retraso cuando el sidebar está cerrado */}
            {!sidebarOpen && showHamburger && (
                <button
                    className="fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#4EB9FA] text-[#2C3E50] shadow-lg border border-[#2C3E50]/10 hover:bg-[#2C3E50] hover:text-white transition-colors duration-200"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Abrir menú lateral"
                >
                    <FiMenu size={26} />
                </button>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen w-56 bg-[#ECEDF2] shadow-2xl z-40 flex flex-col transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <span className="text-[#2C3E50] font-bold text-2xl tracking-wide">GPS App</span>
                    {/* Botón cerrar SIEMPRE visible cuando sidebar está abierto */}
                    {sidebarOpen && (
                        <button
                            className="text-[#2C3E50]"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Cerrar menú lateral"
                        >
                            <FiX size={28} />
                        </button>
                    )}
                </div>
                {/* Información del usuario actual */}
                <div className="px-6 py-4 border-b border-white/10 flex flex-col gap-1 bg-white/60">
                    <span className="font-semibold text-[#2C3E50] text-base flex items-center gap-2">
                        <MdPeople size={60} className="text-[#4EB9FA]" />
                        {user?.nombreCompleto || 'Usuario'}
                    </span>
                    <span className="text-xs text-[#2C3E50] font-medium">{user?.rol || 'Sin rol'}</span>
                </div>
                <nav className="flex-1 flex flex-col gap-2 mt-6 px-4">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={getNavLinkClass}
                        >
                            <span className="flex items-center">{link.icon}{link.label}</span>
                        </NavLink>
                    ))}
                    {userRole === 'administrador' && (
                        <>
                            <NavLink
                                to="/users"
                                onClick={() => setSidebarOpen(false)}
                                className={getNavLinkClass}
                            >
                                <span className="flex items-center"><MdSupervisorAccount size={20} className="mr-2" />Usuarios</span>
                            </NavLink>
                            <NavLink
                                to="/carreras"
                                onClick={() => setSidebarOpen(false)}
                                className={getNavLinkClass}
                            >
                                <span className="flex items-center"><MdCollectionsBookmark size={20} className="mr-2" />Carreras</span>
                            </NavLink>
                        </>

                    )}
                    {userRole === 'encargado_carrera' && (
                        <NavLink
                            to="/miscarreras"
                            onClick={() => setSidebarOpen(false)}
                            className={getNavLinkClass}
                        >
                            <span className="flex items-center"><MdCollectionsBookmark size={20} className="mr-2" />Mis Carreras</span>
                        </NavLink>
                    )}
                    {userRole === 'encargado_carrera' && (
                        <NavLink
                            to="/misusuarios"
                            onClick={() => setSidebarOpen(false)}
                            className={getNavLinkClass}
                        >
                            <span className="flex items-center"><MdCollectionsBookmark size={20} className="mr-2" />Mis Usuarios</span>
                        </NavLink>
                    )}
                </nav>
                <div className="px-4 mb-6 mt-auto">
                    <button
                        onClick={() => { logoutSubmit(); setSidebarOpen(false); }}
                        className="w-full px-4 py-3 rounded-md font-semibold transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white text-left"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

Sidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;