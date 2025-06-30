import React from 'react';
import { FaCheck } from 'react-icons/fa';

const AnswerOption = ({ color, Icon, placeholder, value, isCorrect, onChange, onToggleCorrect, isOptional = false }) => (
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
                className="w-full bg-transparent focus:outline-none p-2 text-white placeholder-white text-sm md:text-base"
            />
        </div>
        <div 
            onClick={onToggleCorrect}
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ${isCorrect ? 'bg-green-500' : 'bg-white/30 hover:bg-white/50'}`}
            title="Marcar como respuesta correcta"
        >
            {isCorrect && <FaCheck className="text-white" />}
        </div>
    </div>
);

export default AnswerOption;