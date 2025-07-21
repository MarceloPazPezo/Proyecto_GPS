import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { socket } from "../main.jsx";
import fondoSVG from '../assets/fondo_azul.svg';

// Importamos los helpers que definen los estilos
import { createDefaultAnswers, createExtraAnswers } from '../helpers/quizHelpers.js'; // Ajusta la ruta si es necesario

// Creamos un array con todas las plantillas de respuesta (iconos y colores)
const answerTemplates = [...createDefaultAnswers(), ...createExtraAnswers()];

const Quiz = () => {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(0);
    const [options, setOptions] = useState([]);
    const [questionText, setQuestionText] = useState("¡Prepárate!");

    // Función para manejar la respuesta del usuario
    const handleAnswerClick = (option) => {
        if (option.id > 0) {
            // ----- LA CORRECCIÓN ESTÁ AQUÍ -----
            // El backend espera un string "true" o "false", no un booleano.
            // Convertimos el booleano a string para que la lógica del servidor funcione como antes.
            socket.emit("answer", { correcta: String(option.correcta), id: option.id });
        }
        // Deshabilitar opciones después de responder
        setOptions([]);
    };

    useEffect(() => {
        const receiveOptions = (data) => {
            if (data && data.respuestas) {
                const styledOptions = data.respuestas.map((backendAnswer, index) => {
                    const template = answerTemplates[index];
                    return {
                        ...template,
                        id: backendAnswer.id,
                        textoRespuesta: backendAnswer.textoRespuesta,
                        correcta: backendAnswer.correcta,
                    };
                });
                setOptions(styledOptions);
                if (data.pregunta && data.pregunta.texto) {
                    setQuestionText(data.pregunta.texto);
                } else {
                    // Si no viene texto de la pregunta, ponemos uno por defecto
                    setQuestionText("¡Responde la pregunta!");
                }
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

        return () => {
            socket.off("opt", receiveOptions);
            socket.off("timer", receiveTime);
            socket.off("finnish", finalizeQuiz);
        };
    }, [navigate]);

    return (
        <div className="h-screen text-white flex flex-col items-center justify-between p-4"
            style={{ backgroundImage: `url(${fondoSVG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            
            <header className="w-full max-w-4xl mx-auto flex justify-between items-center gap-4">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 font-bold text-2xl">
                    <span>{timer}</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-gray-800 font-bold text-lg text-center flex-grow min-h-[58px] flex items-center justify-center">
                    <p>{questionText}</p>
                </div>
            </header>
            
            <main className="w-full max-w-4xl p-2">
                {options.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswerClick(option)}
                                className={`flex items-center w-full p-3 rounded-lg text-white font-bold text-xl transition-transform duration-200 hover:scale-105 ${option.color}`}
                            >
                                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white/20 rounded-md">
                                    {option.Icon && <option.Icon size={30} />}
                                </div>
                                <span>{option.textoRespuesta}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                     <div className="text-center text-2xl font-bold">
                        <p>¡Espera la siguiente pregunta!</p>
                    </div>
                )}
            </main>

            <footer className="h-10"></footer>
        </div>
    )
}

export default Quiz;