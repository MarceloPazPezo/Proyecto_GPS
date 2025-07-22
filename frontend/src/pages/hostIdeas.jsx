import { useState, useEffect } from "react";
import { socket } from "../main"; // Asume que el socket está exportado desde tu archivo principal
import WordCloud from "react-d3-cloud";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. PALETA DE COLORES ---
// Definimos un array con los colores que queremos que se usen en la nube.
const colorPalette = ['#2C3E50', '#2980B9', '#8E44AD', '#34495E', '#27AE60', '#F39C12', '#E74C3C', '#C0392B', '#D35400', '#F1C40F'];

// --- 2. FUNCIÓN QUE ASIGNA UN COLOR A CADA PALABRA ---
// Esta función recibe la palabra y su índice. Usamos el índice para ciclar a través de nuestra paleta.
const fillColor = (word, index) => colorPalette[index % colorPalette.length];

// Esta función decide aleatoriamente si una palabra es horizontal (0 grados) o vertical (90 grados).
const rotate = () => (Math.random() > 0.5 ? 0 : 90);

const HostIdeas = () => {
    const [message, setMessage] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [data, setData] = useState([]);

    /**
     * CRÍTICO: Calcula el tamaño de la fuente de forma dinámica.
     * @param {object} word - El objeto de palabra, ej: { text: 'idea', value: 5 }
     * @returns {number} - El tamaño de la fuente en píxeles.
     */
    const calculateFontSize = (word) => {
        // El tamaño base se reduce a medida que se añaden más palabras únicas.
        // La raíz cuadrada suaviza la reducción para que no sea tan drástica.
        const baseSize = 220 / Math.sqrt(data.length || 1); // || 1 para evitar dividir por cero al inicio

        // Se añade un "bono" de tamaño basado en la frecuencia.
        // El logaritmo hace que el aumento de tamaño sea más notorio al principio.
        const repetitionBonus = Math.log2(word.value) * 25;

        // Se asegura un tamaño mínimo para que las palabras no desaparezcan.
        return Math.max(20, baseSize + repetitionBonus);
    };

    useEffect(() => {
        const recibirRespuestas = (newAnswer) => {
            const palabra = newAnswer.responder.trim().toLowerCase();
            if (!palabra) return; // Ignorar respuestas vacías

            setData((currentData) => {
                const wordIndex = currentData.findIndex(d => d.text === palabra);
                let newData = [...currentData];

                if (wordIndex > -1) {
                    // Si la palabra ya existe, incrementa su valor
                    newData[wordIndex] = {
                        ...newData[wordIndex],
                        value: newData[wordIndex].value + 1,
                    };
                } else {
                    // Si es una palabra nueva, la añade al array
                    newData.push({ text: palabra, value: 1 });
                }
                // Devuelve un nuevo array para que React detecte el cambio de estado
                return [...newData];
            });
        };

        socket.on("respuesta", recibirRespuestas);
        
        // Limpia el listener cuando el componente se desmonta para evitar fugas de memoria
        return () => {
            socket.off("respuesta", recibirRespuestas);
        };
    }, []); // El array vacío asegura que el efecto se ejecute solo una vez (al montar/desmontar)

    const reiniciar = () => {
        setIsStarted(false);
        setMessage("");
        setData([]);
        socket.emit("reiniciar"); // Notifica al servidor que la actividad ha terminado
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim()) {
            socket.emit("comenzar", { pregunta: message });
            setIsStarted(true);
        }
    };
    
    // Configuración para las animaciones de Framer Motion
    const cloudAnimation = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    return (
        <div className="bg-sky-200 min-h-screen flex flex-col justify-center items-center p-4 font-sans">
            {isStarted ? (
                <div className="w-full h-screen flex flex-col items-center">
                    <div className="w-full max-w-4xl p-4 mb-4 text-center">
                        <h2 className="text-[#2C3E50] text-3xl md:text-4xl font-semibold break-words">{message}</h2>
                    </div>
                    
                    <div className="flex-1 w-full max-w-6xl">
                        <AnimatePresence>
                            {data.length > 0 && (
                                <motion.div
                                    // La key es crucial para AnimatePresence. Cambia con cada actualización de datos.
                                    key={data.length + data.reduce((a, b) => a + b.value, 0)}
                                    variants={cloudAnimation}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full"
                                >
                                    <WordCloud
                                        data={data}
                                        font="Impact"
                                        fontSize={calculateFontSize}
                                        rotate={rotate}
                                        padding={5}
                                        fill={fillColor}
                                        // Dimensiones del canvas de dibujo, CSS se encargará de la responsividad del contenedor.
                                        width={window.innerWidth * 0.9}
                                        height={window.innerHeight * 0.6}
                                        onWordClick={(event, d) => { console.log(`'${d.text}' has ${d.value} votes`); }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {data.length === 0 && (
                             <div className="w-full h-full flex justify-center items-center">
                                <p className="text-[#2C3E50] text-2xl animate-pulse">Esperando respuestas...</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={reiniciar}
                        className="w-full max-w-xs mx-auto mt-6 mb-4 px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                    >
                        🔄 Reiniciar
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold text-[#2C3E50] mb-6 text-center">Nube de Palabras</h1>
                        <label htmlFor="pregunta" className="block text-sm font-semibold text-[#2C3E50] mb-2">Escribe tu pregunta:</label>
                        <input
                            id="pregunta"
                            name="message"
                            type="text"
                            placeholder="Ej: ¿Cómo te sientes hoy?"
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 bg-white border border-[#2C3E50]/20 rounded-lg text-[#2C3E50] placeholder-[#2C3E50]/60 focus:outline-none focus:ring-2 focus:ring-[#4EB9FA]/40 transition"
                            value={message}
                            autoFocus
                        />
                         <button 
                            type="submit"
                            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-300 ease-in-out hover:bg-green-600 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={!message.trim()}
                        >
                            Comenzar Actividad
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default HostIdeas;