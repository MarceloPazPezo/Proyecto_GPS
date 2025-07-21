import React from 'react';
import { FaCheck } from 'react-icons/fa';

const AnswerOption = ({ color, Icon, placeholder, value, isCorrect, onChange, onToggleCorrect, isOptional = false }) => {
    // La clave: una variable que nos dice si el input está vacío.
    const isTextEmpty = !value.trim();

    return (
        <div className={`flex items-center ${color} rounded-lg shadow-sm p-2 space-x-2`}>
            <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-md ${color}`}>
                <Icon className="text-white text-2xl md:text-3xl" />
            </div>
            <div className="flex-grow flex items-center">
                <input
                    type="text"
                    placeholder={`${placeholder} ${isOptional ? '(opcional)' : ''}`}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent focus:outline-none p-2 text-white placeholder-white/70 text-sm md:text-base"
                />
            </div>
            
            {/* Convertimos el div en un botón para poder usar 'disabled' */}
            <button
                onClick={onToggleCorrect}
                // Deshabilitamos el botón si el texto está vacío
                disabled={isTextEmpty}
                title={isTextEmpty ? "Escribe un texto para marcarla como correcta" : "Marcar como respuesta correcta"}
                // Aplicamos clases condicionales para el estilo
                className={`
                    flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${isCorrect ? 'bg-green-500' : 'bg-white/30'}
                    ${isTextEmpty 
                        ? 'opacity-50 cursor-not-allowed' // Estilo deshabilitado
                        : 'cursor-pointer hover:bg-white/50' // Estilo habilitado
                    }
                `}
            >
                {isCorrect && <FaCheck className="text-white" />}
            </button>
        </div>
    );
}

export default AnswerOption;