import React from 'react';
import AnswerOption from './AnswerOption';
import { FaPlus, FaMinus } from 'react-icons/fa';

const QuizEditor = ({ slide, onQuestionTextChange, onAnswerTextChange, onToggleCorrect, onToggleExtraAnswers }) => {
    if (!slide) return <div className="flex items-center justify-center h-full text-white text-2xl">Selecciona una diapositiva</div>;

    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="relative z-10  p-4 sm:p-6 md:p-8">
                <input
                    type="text"
                    placeholder={slide.type === 'Quiz' ? "Escribe tu pregunta" : "Escribe tu título"}
                    value={slide.questionText}
                    onChange={(e) => onQuestionTextChange(e.target.value)}
                    className="w-full text-center text-xl sm:text-2xl md:text-3xl  text-gray-800 font-bold p-4 bg-white/60 backdrop-blur rounded-lg shadow-md mb-4 placeholder-gray-500"
                    />
                <div className="bg-white/60 backdrop-blur rounded-lg shadow-md p-6 text-center mb-4">
                    <div className="flex flex-col items-center">
                        <button className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-4xl text-gray-400 hover:bg-gray-50 bg-white backdrop-blur transition-all">
                            <FaPlus />
                        </button>
                        <p className="mt-2 text-gray-700 font-medium text-sm sm:text-base">Busca e inserta multimedia</p>
                    </div>
                </div>

                {slide.type === 'Quiz' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {slide.answers.map((answer, index) => (
                                <AnswerOption
                                    key={index}
                                    {...answer}
                                    value={answer.text}
                                    onChange={(e) => onAnswerTextChange(index, e.target.value)}
                                    onToggleCorrect={() => onToggleCorrect(index)}
                                />
                            ))}
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={onToggleExtraAnswers}
                                className={`text-white font-semibold px-4 py-2 rounded-full flex items-center space-x-2 backdrop-blur transition-colors ${slide.answers.length === 4 ? 'bg-gray-800/80 hover:bg-gray-900/80' : 'bg-red-600/80 hover:bg-red-700/80'}`}>
                                {slide.answers.length === 4 ? <FaPlus /> : <FaMinus />}
                                <span className="text-sm sm:text-base">{slide.answers.length === 4 ? 'Añadir más respuestas' : 'Quitar extras'}</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizEditor;