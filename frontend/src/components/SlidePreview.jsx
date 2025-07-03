import React from 'react';
import { FaTrash, FaRegImage, FaExclamationCircle } from 'react-icons/fa';

const SlidePreview = ({ slide, slideNumber, isActive, onSelect, onDelete }) => {
    const showWarningIcon = 
        slide.type === 'Quiz' && 
        !slide.questionText.trim() && 
        slide.answers && 
        slide.answers.some(answer => answer.text.trim() !== '');

    return (
        <div className="flex items-start space-x-3 p-2">
            <div className="flex flex-col items-center space-y-2 text-gray-500 pt-1">
                <span className="text-sm font-bold">{slideNumber}</span>
                {onDelete && <FaTrash onClick={(e) => { e.stopPropagation(); onDelete(); }} className="cursor-pointer hover:text-red-600" title="Eliminar diapositiva" />}
            </div>
            <div 
                onClick={onSelect}
                className={`w-full bg-white rounded-lg p-2.5 shadow-md cursor-pointer transition-all border-2 ${isActive ? 'border-blue-500' : 'border-transparent'}`}
            >
                <p className="text-xs text-gray-500 font-semibold mb-1">{slide.type}</p>
                <div className="relative bg-gray-100 rounded-md p-2 h-20 flex flex-col items-center justify-center space-y-1">
                    <p className="text-sm text-gray-700">{slide.questionText || (slide.type === 'Quiz' ? 'Pregunta' : 'Título')}</p>
                    <div className="w-10 h-8 bg-gray-200 border-2 border-dashed rounded-md flex items-center justify-center">
                        <FaRegImage className="text-gray-400" />
                    </div>
                    {slide.type === 'Quiz' && (
                        <div className="flex space-x-1">
                            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                    )}
                    {showWarningIcon && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                            <FaExclamationCircle size={12} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlidePreview;