import { useState, useEffect } from "react"
import { socket } from "../main";
import "../styles/index.css"
import { useNavigate } from "react-router-dom";
import fondoSVG from '../assets/fondo_azul.svg';

const pizarraIdeas = () => {
    const navigate = useNavigate();
    const [respuesta, setRespuesta] = useState("");
    const [estado, setEstado] = useState(false);
    const [com, setCom] = useState(false)

    const responder = (e) => {
        e.preventDefault();
        socket.emit("respuesta", { responder: respuesta })
        setEstado(true)
    }

    useEffect(() => {
        socket.on("reiniciar", (data) => {
            setEstado(false)
            setCom(false)
        })
        socket.on("comenzar", (data) => {
            setCom(true)
        })
        socket.on("finnish", () => {
            navigate("/join");
        })
    }, []);

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
            {estado ? (
                <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl rounded-2xl p-8 text-center flex flex-col items-center gap-6">
                    <h5 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">Has respondido con:</h5>
                    <div className="bg-[#4EB9FA]/10 rounded-xl p-6 border border-[#4EB9FA]/30">
                        <h3 className="text-3xl sm:text-5xl font-bold text-[#4EB9FA]">{respuesta}</h3>
                    </div>
                </div>
            ) : com ? (
                <div className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl rounded-2xl p-8 text-center flex flex-col items-center gap-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">Tu respuesta</h1>
                    <form onSubmit={responder} className="w-full flex flex-col gap-4">
                        <input
                            name="message"
                            type="text"
                            placeholder="Escribe tu respuesta"
                            onChange={(e) => setRespuesta(e.target.value)}
                            className="w-full p-3 border border-[#4EB9FA]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EB9FA] focus:border-[#4EB9FA] text-[#2C3E50]"
                            value={respuesta}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Enviar Respuesta
                        </button>
                    </form>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl rounded-2xl p-8 text-center flex flex-col items-center gap-6">
                    <div
                        className="w-16 h-16 animate-spin rounded-full border-4 border-dashed border-[#4EB9FA]"
                        role="status"
                        aria-label="Cargando"
                    ></div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                        Sala de Espera
                    </h1>
                    <p className="text-base text-[#2C3E50]/80">
                        Por favor, espera a que el anfitrión inicie la actividad.
                    </p>
                </div>
            )}
        </main>
    )
}

export default pizarraIdeas