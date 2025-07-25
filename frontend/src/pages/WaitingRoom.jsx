import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../main";
import fondoSVG from '../assets/fondo_azul.svg';

const WaitingRoom = () => {
    const navigate = useNavigate();

    const iniciarAct = (message) => {
        if (message.actividad === 'quiz') navigate("/quiz");
        if (message.actividad === 'pizarra') navigate("/ideas");
        if (message.actividad === 'notas') navigate("/notas");
    };

    const cancelarAct = () => {
        // Limpia el estado de la sesión si es necesario antes de redirigir
        sessionStorage.removeItem('sala');
        navigate('/join');
    };

    useEffect(() => {
        socket.on('start', iniciarAct);
        socket.on('finnish', cancelarAct);

        // Buena práctica: limpiar los listeners cuando el componente se desmonta
        return () => {
            socket.off('start', iniciarAct);
            socket.off('finnish', cancelarAct);
        };
    }, [navigate]); // Añadir navigate a las dependencias del useEffect

    return (
        // --- CAMBIO: Contenedor principal con fondo SVG ---
        <main
            className="flex items-center justify-center min-h-screen w-full p-4"
            style={{
                backgroundImage: `url(${fondoSVG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* --- CAMBIO: Tarjeta central con el estilo de la aplicación --- */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl rounded-2xl p-8 text-center flex flex-col items-center gap-6">

                {/* --- NUEVO: Indicador visual (spinner) para mostrar que se está esperando --- */}
                <div
                    className="w-16 h-16 animate-spin rounded-full border-4 border-dashed border-[#4EB9FA]"
                    role="status"
                    aria-label="Cargando"
                ></div>

                {/* --- CAMBIO: Título con la paleta de colores y tipografía responsiva --- */}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                    Sala de Espera
                </h1>

                <p className="text-base text-[#2C3E50]/80">
                    Por favor, espera a que el anfitrión inicie la actividad.
                </p>

            </div>
        </main>
    );
};

export default WaitingRoom;