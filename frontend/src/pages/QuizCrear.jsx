import React, { useState } from 'react';
// ICONOS
import { FaRegImage, FaPlus, FaMinus, FaTrash, FaRegCopy, FaExclamationCircle, FaCheck } from 'react-icons/fa'; 
import { MdFlashOn } from 'react-icons/md';
import { GiCrystalBars } from 'react-icons/gi';
import { TbWorld } from 'react-icons/tb';
import { PiPuzzlePieceFill } from 'react-icons/pi';
import { BsPentagonFill, BsStarFill } from 'react-icons/bs';

// --- IMPORTACIÓN DE SERVICIOS ---
 import { crearQuiz, addQuizPreguntas } from '../services/quiz.service.js'; // Ajusta la ruta si es necesario

// --- COMPONENTES REUTILIZABLES ---

// Componente AnswerOption ahora incluye un checkbox para la respuesta correcta
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
        {/* Checkbox para marcar la respuesta correcta */}
        <div 
            onClick={onToggleCorrect}
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                isCorrect ? 'bg-green-500' : 'bg-white/30 hover:bg-white/50'
            }`}
            title="Marcar como respuesta correcta"
        >
            {isCorrect && <FaCheck className="text-white" />}
        </div>
    </div>
);

const SlidePreview = ({ slideNumber, type, questionText, answers, isActive, onSelect, onDelete }) => {
    const showWarningIcon = 
        type === 'Quiz' && 
        !questionText.trim() && 
        answers && 
        answers.some(answer => answer.text.trim() !== '');

    return (
        <div className="flex items-start space-x-3 p-2">
            <div className="flex flex-col items-center space-y-2 text-gray-500 pt-1">
                <span className="text-sm font-bold">{slideNumber}</span>
                {onDelete && (
                    <FaTrash 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                        className="cursor-pointer hover:text-red-600" 
                        title="Eliminar diapositiva" 
                    />
                )}
            </div>
            <div 
                onClick={onSelect}
                className={`w-full bg-white rounded-lg p-2.5 shadow-md cursor-pointer transition-all border-2 ${isActive ? 'border-blue-500' : 'border-transparent'}`}
            >
                <p className="text-xs text-gray-500 font-semibold mb-1">{type}</p>
                <div className="relative bg-gray-100 rounded-md p-2 h-20 flex flex-col items-center justify-center space-y-1">
                    <p className="text-sm text-gray-700">{questionText || (type === 'Quiz' ? 'Pregunta' : 'Título')}</p>
                    <div className="w-10 h-8 bg-gray-200 border-2 border-dashed rounded-md flex items-center justify-center">
                        <FaRegImage className="text-gray-400" />
                    </div>
                    {type === 'Quiz' && (
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

// --- ESTRUCTURAS DE DATOS Y FUNCIONES AUXILIARES ---

const createDefaultAnswers = () => [
    { placeholder: "Respuesta 1", text: "", color: "bg-orange-600/80", Icon: MdFlashOn, isOptional: false, isCorrect: true }, // La primera es correcta por defecto
    { placeholder: "Respuesta 2", text: "", color: "bg-purple-700/80", Icon: GiCrystalBars, isOptional: false, isCorrect: false },
    { placeholder: "Respuesta 3", text: "", color: "bg-amber-500/80", Icon: TbWorld, isOptional: true, isCorrect: false },
    { placeholder: "Respuesta 4", text: "", color: "bg-cyan-700/80", Icon: PiPuzzlePieceFill, isOptional: true, isCorrect: false },
];

const createNewQuestion = (type = 'Quiz') => ({
    id: Date.now(),
    type: type,
    questionText: '',
    answers: type === 'Quiz' ? createDefaultAnswers() : [], 
});

// --- COMPONENTE PRINCIPAL ---

function QuizCrear() {
    const [questions, setQuestions] = useState([createNewQuestion('Quiz')]);
    const [activeQuestionId, setActiveQuestionId] = useState(questions[0].id);
    const [isSaving, setIsSaving] = useState(false);
    const [quizTitle, setQuizTitle] = useState(''); // Estado para el título del cuestionario

    const activeQuestion = questions.find(q => q.id === activeQuestionId) || questions[0];
    
    // --- MANEJADORES DE EVENTOS ---

    const handleAddQuestion = () => {
        const newQuestion = createNewQuestion('Quiz');
        setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
        setActiveQuestionId(newQuestion.id);
    };
    
    const handleAddSlide = () => {
        const newSlide = createNewQuestion('Diapositiva');
        setQuestions(prevQuestions => [...prevQuestions, newSlide]);
        setActiveQuestionId(newSlide.id);
    };

    const handleSelectQuestion = (id) => {
        setActiveQuestionId(id);
    };
    
    const handleDeleteQuestion = (idToDelete) => {
        if (questions.length <= 1) return;
        setQuestions(prevQuestions => {
            const remainingQuestions = prevQuestions.filter(q => q.id !== idToDelete);
            if (activeQuestionId === idToDelete) {
                setActiveQuestionId(remainingQuestions[0]?.id || null);
            }
            return remainingQuestions;
        });
    };

    const handleQuestionTextChange = (e) => {
        setQuestions(prevQuestions => 
            prevQuestions.map(q => 
                q.id === activeQuestionId ? { ...q, questionText: e.target.value } : q
            )
        );
    };
    
    const handleAnswerTextChange = (answerIndex, newText) => {
        setQuestions(prevQuestions => 
            prevQuestions.map(q => {
                if (q.id === activeQuestionId) {
                    const newAnswers = [...q.answers];
                    newAnswers[answerIndex].text = newText;
                    return { ...q, answers: newAnswers };
                }
                return q;
            })
        );
    };

    // Nueva función para marcar una respuesta como correcta (y desmarcar las demás)
    const handleToggleCorrectAnswer = (clickedAnswerIndex) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q => {
                if (q.id === activeQuestionId) {
                    const newAnswers = q.answers.map((answer, index) => ({
                        ...answer,
                        isCorrect: index === clickedAnswerIndex
                    }));
                    return { ...q, answers: newAnswers };
                }
                return q;
            })
        );
    };

    const toggleExtraAnswers = () => {
        setQuestions(prevQuestions =>
            prevQuestions.map(q => {
                if (q.id === activeQuestionId) {
                    const updatedQuestion = { ...q };
                    if (updatedQuestion.answers.length === 4) {
                        const extraAnswers = [
                            { placeholder: "Respuesta 5", text: "", color: "bg-teal-500/80", Icon: BsPentagonFill, isOptional: true, isCorrect: false },
                            { placeholder: "Respuesta 6", text: "", color: "bg-pink-500/80", Icon: BsStarFill, isOptional: true, isCorrect: false },
                        ];
                        updatedQuestion.answers = [...updatedQuestion.answers, ...extraAnswers];
                    } else {
                        updatedQuestion.answers = createDefaultAnswers();
                    }
                    return updatedQuestion;
                }
                return q;
            })
        );
    };

    // --- LÓGICA DE GUARDADO ---
    const handleSave = async () => {
        // Validación 1: Título del Quiz
        if (!quizTitle.trim()) {
            alert("Por favor, introduce un título para el cuestionario en la sección de Configuraciones.");
            return;
        }

        // Validación 2: Cada pregunta debe tener una respuesta correcta
        const questionsWithInvalidAnswers = questions
            .filter(q => q.type === 'Quiz')
            .filter(q => q.answers.filter(a => a.isCorrect).length !== 1);

        if (questionsWithInvalidAnswers.length > 0) {
            alert(`La pregunta "${questionsWithInvalidAnswers[0].questionText || 'sin título'}" debe tener exactamente UNA respuesta marcada como correcta.`);
            return;
        }

        setIsSaving(true);
        try {
            // PASO 1: Crear el Quiz usando el título del estado
            const quizInfo = {
                nombre: quizTitle,
                idUser: 1 // Este valor podría venir de un contexto de usuario, etc.
            };
            const createdQuizResponse = await crearQuiz(quizInfo);
            // Simulación de respuesta
            //const createdQuizResponse = { status: 'Success', data: { id: Math.floor(Math.random() * 1000) } };

            if (createdQuizResponse?.status !== 'Success' || !createdQuizResponse.data?.id) {
                throw new Error("No se pudo crear el quiz.");
            }

            const newQuizId = createdQuizResponse.data.id;
            
            // PASO 2: Formatear y añadir las preguntas
            const formattedQuestions = questions
                .filter(q => q.type === 'Quiz' && q.questionText.trim() !== '')
                .map(q => ({
                    texto: q.questionText,
                    Respuestas: q.answers
                        .filter(ans => ans.text.trim() !== '')
                        .map(ans => ({
                            textoRespuesta: ans.text,
                            correcta: ans.isCorrect // Usamos el valor del estado
                        }))
                }));

            if (formattedQuestions.length === 0) {
                alert("No hay preguntas válidas para guardar. Añade texto a tus preguntas.");
                setIsSaving(false);
                return;
            }

            await addQuizPreguntas(formattedQuestions, newQuizId);
            console.log("Enviando a la API...", { quizId: newQuizId, questions: formattedQuestions });
            
            alert("¡Quiz guardado exitosamente! (Simulación)");

        } catch (error) {
            console.error("Error en el proceso de guardado:", error);
            alert(`Error al guardar: ${error.message || 'Revisa la consola.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
        <div className="h-screen bg-gray-100 font-sans flex flex-col">
            <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center bg-white p-3 sm:p-2 shadow-sm border-b gap-2 sm:gap-4 z-20">
                <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Freehoot!</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-gray-200 text-gray-700 rounded-md px-3 py-2 text-sm sm:text-base font-semibold hover:bg-gray-300">Salir</button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-600 text-white rounded-md px-3 py-2 text-sm sm:text-base font-bold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </header>

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                <div className="order-first w-full lg:w-72 flex-shrink-0 bg-gray-50 border-r flex flex-col overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-2">
                        {questions.map((q, index) => (
                            <SlidePreview
                                key={q.id}
                                slideNumber={index + 1}
                                type={q.type}
                                questionText={q.questionText}
                                answers={q.answers}
                                isActive={q.id === activeQuestionId}
                                onSelect={() => handleSelectQuestion(q.id)}
                                onDelete={questions.length > 1 ? () => handleDeleteQuestion(q.id) : null}
                            />
                        ))}
                    </div>
                    <div className="flex-shrink-0 p-4 space-y-2 border-t bg-gray-50">
                         <button onClick={handleAddQuestion} className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Añadir pregunta
                        </button>
                        <button onClick={handleAddSlide} className="w-full bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                            Añadir diapositiva
                        </button>
                    </div>
                </div>

                <main className="flex-grow p-4 md:p-6 overflow-y-auto order-2 bg-gradient-to-br from-sky-400 to-blue-600">
                    {activeQuestion && (
                        <div className="relative max-w-4xl mx-auto">
                            <div className="relative z-10 bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                                <input
                                    type="text"
                                    placeholder={activeQuestion.type === 'Quiz' ? "Escribe tu pregunta" : "Escribe tu título"}
                                    value={activeQuestion.questionText}
                                    onChange={handleQuestionTextChange}
                                    className="w-full text-center text-xl sm:text-2xl md:text-3xl font-bold p-4 bg-white/60 backdrop-blur rounded-lg shadow-md mb-4 placeholder-gray-500"
                                />
                                <div className="bg-white/60 backdrop-blur rounded-lg shadow-md p-6 text-center mb-4">
                                   <div className="flex flex-col items-center">
                                        <button className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-4xl text-gray-400 hover:bg-gray-50 bg-white backdrop-blur transition-all">
                                            <FaPlus />
                                        </button>
                                        <p className="mt-2 text-gray-700 font-medium text-sm sm:text-base">Busca e inserta multimedia</p>
                                    </div>
                                </div>
                                
                                {activeQuestion.type === 'Quiz' && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {activeQuestion.answers.map((answer, index) => (
                                                <AnswerOption 
                                                    key={index}
                                                    {...answer}
                                                    value={answer.text}
                                                    onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                                                    onToggleCorrect={() => handleToggleCorrectAnswer(index)}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <button 
                                                onClick={toggleExtraAnswers}
                                                className={`text-white font-semibold px-4 py-2 rounded-full flex items-center space-x-2 backdrop-blur transition-colors ${activeQuestion.answers.length === 4 ? 'bg-gray-800/80 hover:bg-gray-900/80' : 'bg-red-600/80 hover:bg-red-700/80'}`}>
                                                {activeQuestion.answers.length === 4 ? <FaPlus /> : <FaMinus />}
                                                <span className="text-sm sm:text-base">{activeQuestion.answers.length === 4 ? 'Añadir más respuestas' : 'Quitar extras'}</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                <aside className="w-full lg:w-80 bg-white p-4 border-t lg:border-t-0 lg:border-l flex-shrink-0 overflow-y-auto order-last lg:order-3">
                    <h2 className="text-xl font-bold mb-4">Configuraciones</h2>
                    <div className="space-y-4">
                        {/* Campo para el título del cuestionario */}
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700">Título del Cuestionario</label>
                            <input 
                                type="text"
                                id="quiz-title"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                placeholder="Ej: Capitales del Mundo"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            />
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <label htmlFor="time-limit" className="block text-sm font-medium text-gray-700">Límite de tiempo</label>
                            <select id="time-limit" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                <option>20 segundos</option>
                                <option>30 segundos</option>
                                <option>60 segundos</option>
                            </select>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default QuizCrear;