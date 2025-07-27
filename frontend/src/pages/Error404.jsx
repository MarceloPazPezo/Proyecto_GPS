import { Link } from 'react-router-dom';
import fondoSVG from '../assets/fondo_azul.svg';

const Error404 = () => {
    return (
        <main
            className="flex items-center justify-center min-h-screen w-full p-4"
            style={{
                backgroundImage: `url(${fondoSVG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl rounded-2xl p-8 text-center flex flex-col items-center gap-6">
                
                  <div className="text-8xl opacity-20">
                    🔍
                </div>
                {/* Número 404 grande y llamativo */}
                <div className="text-8xl sm:text-9xl font-black text-[#4EB9FA] leading-none">
                    404
                </div>
                 {/* Icono decorativo */}
              
                
                {/* Título principal */}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                    Página no encontrada
                </h1>
                
                {/* Descripción */}
                <p className="text-base text-[#2C3E50]/80 leading-relaxed">
                    Lo sentimos, la página que estás buscando no existe.
                </p>
                
                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link 
                        to="/home"
                        className="flex-1 bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
                    >
                        Ir al Inicio
                    </Link>
                    <button 
                        onClick={() => window.history.back()}
                        className="flex-1 bg-[#FF9233] hover:bg-[#ffae66] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Volver
                    </button>
                </div>
                
               
                
            </div>
        </main>
    );
};

export default Error404;