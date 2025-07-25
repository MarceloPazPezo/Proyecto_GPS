import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { socket } from "../main.jsx";
import fondoSVG from '../assets/fondo_azul.svg';

// Importamos los helpers que definen los estilos y colores de las respuestas
import { createDefaultAnswers, createExtraAnswers } from '../helpers/quizHelpers.js'; // Ajusta la ruta si es necesario

// Creamos un array único con todas las plantillas de respuesta
const answerTemplates = [...createDefaultAnswers(), ...createExtraAnswers()];

const Quiz = () => {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(0);
    const [options, setOptions] = useState([]);
    const [questionText, setQuestionText] = useState("¡Prepárate!");

    // Función para manejar la respuesta del usuario
    const handleAnswerClick = (option) => {
        // Solo emitir si es una opción válida (con id)
        if (option.id > 0) {
            socket.emit("answer", { correcta: String(option.correcta), id: option.id });
        }
        // Deshabilitar opciones inmediatamente después de responder para evitar múltiples clics
        setOptions([]);
    };

    useEffect(() => {
        const receiveOptions = (data) => {
            if (data && data.respuestas) {
                // Mapeamos las respuestas del backend a nuestras plantillas con estilos
                const styledOptions = data.respuestas.map((backendAnswer, index) => {
                    // Usamos el operador módulo para ciclar a través de las plantillas si hay más respuestas que plantillas
                    const template = answerTemplates[index % answerTemplates.length];
                    return {
                        ...template, // Aplica color e icono de la plantilla
                        id: backendAnswer.id,
                        textoRespuesta: backendAnswer.textoRespuesta,
                        correcta: backendAnswer.correcta,
                    };
                });
                setOptions(styledOptions);
                setQuestionText(data.pregunta?.texto || "¡Responde la pregunta!");
            }
        };

        const receiveTime = (data) => {
            setTimer(data.time);
        };

        const finalizeQuiz = () => {
            sessionStorage.removeItem('sala');
            navigate("/join");
        };

        socket.on("opt", receiveOptions);
        socket.on("timer", receiveTime);
        socket.on("finnish", finalizeQuiz);

        // Buena práctica: limpiar los listeners cuando el componente se desmonta
        return () => {
            socket.off("opt", receiveOptions);
            socket.off("timer", receiveTime);
            socket.off("finnish", finalizeQuiz);
        };
    }, [navigate]); // Añadir navigate a las dependencias del useEffect

    return (
        // Layout principal que centra el contenido en un fondo neutro
        <main className="min-h-screen bg-gray-100 text-white flex flex-col items-center p-4"
        style={{ backgroundImage: `url(${fondoSVG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            
            {/* Header responsivo: en móviles, el timer va arriba; en pantallas grandes, al lado */}
            <header className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="bg-[#2C3E50] rounded-xl p-3 px-6 font-bold text-3xl shadow-lg">
                    <span>{timer}</span>
                </div>
                {/* Tarjeta de la pregunta, consistente con el diseño de la app */}
                <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 text-[#2C3E50] font-semibold text-lg text-center flex-grow min-h-[76px] flex items-center justify-center shadow-md border border-gray-200">
                    <p>{questionText}</p>
                </div>
            </header>
            
            {/* El área principal crece para ocupar el espacio disponible */}
            <div className="w-full max-w-4xl mx-auto flex-grow flex items-center justify-center">
                {options.length > 0 ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswerClick(option)}
                                // Tipografía responsiva y altura mínima para mejorar usabilidad táctil
                                className={`flex items-center w-full p-4 rounded-lg text-white font-bold text-lg sm:text-xl transition-transform duration-200 hover:scale-105 shadow-lg min-h-[64px] ${option.color}`}
                            >
                                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 mr-4 bg-white/20 rounded-md">
                                    {option.Icon && <option.Icon size={30} />}
                                </div>
                                <span className="text-left">{option.textoRespuesta}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    // Estado de "espera" mejorado visualmente con una tarjeta y spinner
                    <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl rounded-2xl p-8 text-center flex flex-col items-center gap-6">
                        <div 
                            className="w-12 h-12 animate-spin rounded-full border-4 border-dashed border-[#4EB9FA]"
                            role="status"
                            aria-label="Cargando"
                        ></div>
                        <h2 className="text-2xl font-bold text-[#2C3E50]">¡Espera la siguiente pregunta!</h2>
                        <p className="text-base text-[#2C3E50]/80">Prepárate para responder...</p>
                    </div>
                )}
            </div>

        </main>
    )
}

export default Quiz;