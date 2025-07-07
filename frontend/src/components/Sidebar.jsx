
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import { useAuth } from '@context/AuthContext';
import { FiMenu, FiX } from "react-icons/fi";
import { MdExpandMore, MdHome, MdLibraryBooks, MdGroup, MdSupervisorAccount, MdPerson, MdPeople } from "react-icons/md";
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
                        <div className="mt-4">
                            <button
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-md font-semibold transition-colors duration-200 text-base mb-2 focus:outline-none text-[#2C3E50] hover:bg-[#4EB9FA]/30 hover:text-white`}
                                onClick={() => setOpenRRHH((prev) => !prev)}
                                type="button"
                                aria-expanded={openRRHH}
                            >
                                <span className="flex items-center gap-2">
                                    <MdExpandMore className={`transition-transform duration-200 ${openRRHH ? 'rotate-0' : '-rotate-90'}`} size={24} />
                                    Recursos Humanos
                                </span>
                            </button>
                            {openRRHH && (
                                <div className="flex flex-col gap-1 animate-fade-in pl-6 border-l-2 border-[#4EB9FA]/30 ml-2">
                                    <NavLink
                                        to="/users"
                                        onClick={() => setSidebarOpen(false)}
                                        className={getNavLinkClass}
                                    >
                                        <span className="flex items-center"><MdSupervisorAccount size={20} className="mr-2" />Usuarios</span>
                                    </NavLink>
                                    <NavLink
                                        to="/mis-tutores"
                                        onClick={() => setSidebarOpen(false)}
                                        className={getNavLinkClass}
                                    >
                                        <span className="flex items-center"><MdPerson size={20} className="mr-2" />Mis tutores</span>
                                    </NavLink>
                                    <NavLink
                                        to="/mis-tutorados"
                                        onClick={() => setSidebarOpen(false)}
                                        className={getNavLinkClass}
                                    >
                                        <span className="flex items-center"><MdPeople size={20} className="mr-2" />Mis tutorados</span>
                                    </NavLink>
                                </div>
                            )}
                        </div>
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