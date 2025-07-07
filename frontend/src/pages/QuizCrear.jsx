import React, { useState } from 'react';
import { useQuizBuilder } from '../hooks/crearQuiz/useQuizBuilder.jsx';
import { crearQuiz, addQuizPreguntas } from '../services/quiz.service.js';
import SlidePreview from '../components/SlidePreview.jsx';
import QuizEditor from '../components/QuizEditor.jsx';

function QuizCrear() {
    const {
        slides,
        activeSlide,
        activeSlideId,
        setActiveSlideId,
        addSlide,
        deleteSlide,
        handleQuestionTextChange,
        handleAnswerTextChange,
        handleToggleCorrectAnswer,
        toggleExtraAnswers,
    } = useQuizBuilder();

    const [isSaving, setIsSaving] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');

    const handleSave = async () => {
        if (!quizTitle.trim()) {
            alert("Por favor, introduce un título para el cuestionario.");
            return;
        }

        const questionsToSave = slides.filter(s => s.type === 'Quiz');
        const invalidQuestion = questionsToSave.find(q => q.answers.filter(a => a.isCorrect).length !== 1);

        if (invalidQuestion) {
            alert(`La pregunta "${invalidQuestion.questionText || 'sin título'}" debe tener exactamente UNA respuesta correcta.`);
            return;
        }

        setIsSaving(true);
        try {
            const quizInfo = { nombre: quizTitle, idUser: JSON.parse(sessionStorage.getItem('usuario')).id };
            const createdQuiz = await crearQuiz(quizInfo);
            const newQuizId = createdQuiz.data.id;

            const formattedQuestions = questionsToSave
                .filter(q => q.questionText.trim() !== '')
                .map(q => ({
                    texto: q.questionText,
                    Respuestas: q.answers
                        .filter(a => a.text.trim() !== '')
                        .map(a => ({ textoRespuesta: a.text, correcta: a.isCorrect }))
                }));

            if (formattedQuestions.length === 0) throw new Error("No hay preguntas válidas para guardar.");

            await addQuizPreguntas(formattedQuestions, newQuizId);
            alert("¡Quiz guardado exitosamente!");

        } catch (error) {
            console.error("Error al guardar:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#ECEDF2] font-sans flex flex-col">
            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                <div className="order-first w-full lg:w-72 flex-shrink-0 bg-[#ECEDF2] border-r flex flex-col overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-2">
                        {slides.map((slide, index) => (
                            <SlidePreview
                                key={slide.id}
                                slide={slide}
                                slideNumber={index + 1}
                                isActive={slide.id === activeSlideId}
                                onSelect={() => setActiveSlideId(slide.id)}
                                onDelete={slides.length > 1 ? () => deleteSlide(slide.id) : null}
                            />
                        ))}
                    </div>
                    <div className="flex-shrink-0 p-4 space-y-2 border-t ">
                        <button onClick={() => addSlide('Quiz')} className="w-full bg-[#FF9233]/80 text-[#2C3E50] font-bold py-2.5 px-4 rounded-lg hover:bg-[#FF9233]">Añadir pregunta</button>
                        <button onClick={() => addSlide('Diapositiva')} className="w-full bg-gray-200 text-[#2C3E50] font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300">Añadir diapositiva</button>
                    </div>
                </div>

                <main className="flex-grow p-4 md:p-6 overflow-y-auto order-2 bg-gradient-to-br from-sky-400 to-blue-600">
                    <QuizEditor
                        slide={activeSlide}
                        onQuestionTextChange={handleQuestionTextChange}
                        onAnswerTextChange={handleAnswerTextChange}
                        onToggleCorrect={handleToggleCorrectAnswer}
                        onToggleExtraAnswers={toggleExtraAnswers}
                    />
                </main>

                <aside className="w-full lg:w-80 bg-white p-4 border-t lg:border-t-0 lg:border-l flex-shrink-0 overflow-y-auto order-last lg:order-3">
                    <h2 className="text-xl font-bold mb-4">Configuraciones</h2>
                    <div className="space-y-4">
                        
                        <button onClick={handleSave} disabled={isSaving} className="bg-green-600 text-white rounded-md px-3 py-2 text-sm sm:text-base font-bold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700">Título del Cuestionario</label>
                            <input type="text" id="quiz-title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Ej: Capitales del Mundo" className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <label htmlFor="time-limit" className="block text-sm font-medium text-gray-700">Límite de tiempo</label>
                            <select id="time-limit" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                <option>20 segundos</option>
                            </select>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default QuizCrear;