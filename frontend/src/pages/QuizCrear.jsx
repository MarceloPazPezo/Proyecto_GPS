import React, { useState } from 'react';
import { useQuizBuilder } from '../hooks/crearQuiz/useQuizBuilder.jsx';
import { crearQuiz, addQuizPreguntas } from '../services/quiz.service.js';
import SlidePreview from '../components/SlidePreview.jsx';
import QuizEditor from '../components/QuizEditor.jsx';
import fondoSVG from '../assets/fondo_azul.svg';
import { showErrorAlert, showSuccessAlert } from '../helpers/sweetAlert.js'; // Ajusta la ruta si es necesario

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
        setAllSlides
    } = useQuizBuilder();

    const [isSaving, setIsSaving] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleSave = async () => {
        const errors = {};

        // 1. Validar que haya un título
        if (!quizTitle.trim()) {
            showErrorAlert('Título requerido', 'Por favor, introduce un título para el cuestionario.');
            return;
        }

        const questionsToValidate = slides.filter(s => s.type === 'Quiz');
        
        if (questionsToValidate.length === 0) {
            showErrorAlert('Sin preguntas', 'Debes añadir al menos una pregunta para guardar el cuestionario.');
            return;
        }

        // 2. Validar cada pregunta
        questionsToValidate.forEach(q => {
            const answersWithText = q.answers.filter(a => a.text.trim() !== '');
            const correctAnswers = q.answers.filter(a => a.isCorrect);

            if (!q.questionText.trim()) {
                errors[q.id] = 'no_question_text';
            } else if (answersWithText.length < 2) {
                errors[q.id] = 'not_enough_answers';
            } else if (correctAnswers.length < 1) { // <-- CAMBIO AQUÍ: la nueva regla es >= 1
                errors[q.id] = 'no_correct_answer';
            }
        });

        // 3. Comprobar si se encontraron errores
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showErrorAlert('Revisa tu cuestionario', 'Algunas preguntas están incompletas o no tienen al menos una respuesta correcta. Por favor, corrígelas.');
            const firstErrorSlideId = Object.keys(errors)[0];
            setActiveSlideId(firstErrorSlideId);
            return;
        }

        setValidationErrors({});

        setIsSaving(true);
        try {
            const quizInfo = { nombre: quizTitle, idUser: JSON.parse(sessionStorage.getItem('usuario')).id };
            const createdQuiz = await crearQuiz(quizInfo);
            const newQuizId = createdQuiz.data.id;

            const formattedQuestions = questionsToValidate.map(q => ({
                texto: q.questionText,
                Respuestas: q.answers
                    .filter(a => a.text.trim() !== '')
                    .map(a => ({ textoRespuesta: a.text, correcta: a.isCorrect }))
            }));

            await addQuizPreguntas(formattedQuestions, newQuizId);
            
            showSuccessAlert('¡Éxito!', 'Cuestionario guardado exitosamente.');

            setQuizTitle('');
            setAllSlides(null);

        } catch (error) {
            console.error("Error al guardar:", error);
            showErrorAlert('Error al guardar', ` ${error.message || 'Ocurrió un error al guardar el cuestionario.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="font-sans flex flex-col">
            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                <div className="order-first w-full lg:w-72 flex-shrink-0 border-r flex flex-col overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-2">
                        {slides.map((slide, index) => (
                            <SlidePreview
                                key={slide.id}
                                slide={slide}
                                slideNumber={index + 1}
                                isActive={slide.id === activeSlideId}
                                onSelect={() => setActiveSlideId(slide.id)}
                                onDelete={slides.length > 1 ? () => deleteSlide(slide.id) : null}
                                errorType={validationErrors[slide.id]}
                            />
                        ))}
                    </div>
                    <div className="flex-shrink-0 p-4 space-y-2 border-t ">
                        <button onClick={() => addSlide('Quiz')} className="w-full bg-[#4EB9FA]/80 text-[#2C3E50] font-bold py-2.5 px-4 rounded-lg hover:bg-[#B0DFFD]">Añadir pregunta</button>
                        <button onClick={() => addSlide('Diapositiva')} className="w-full bg-[#4EB9FA]/80 text-[#2C3E50] font-bold py-2.5 px-4 rounded-lg hover:bg-[#B0DFFD]">Añadir diapositiva</button>
                    </div>
                </div>

                <main className="flex-grow p-4 md:p-6 overflow-y-auto order-2 "
                    style={{ backgroundImage: `url(${fondoSVG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <QuizEditor
                        slide={activeSlide}
                        onQuestionTextChange={handleQuestionTextChange}
                        onAnswerTextChange={handleAnswerTextChange}
                        onToggleCorrect={handleToggleCorrectAnswer}
                        onToggleExtraAnswers={toggleExtraAnswers}
                    />
                </main>

                <aside className="w-full lg:w-80 bg-gray-200 p-4 border-t lg:border-t-0 lg:border-l flex-shrink-0 overflow-y-auto order-last lg:order-3">
                    <h2 className="text-xl font-bold mb-4 text-[#2C3E50]">Configuraciones</h2>
                    <div className="space-y-4">
                        <button onClick={handleSave} disabled={isSaving} className="w-full bg-green-600 text-white rounded-md px-3 py-3 text-lg font-bold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700">Título del Cuestionario</label>
                            <input type="text" id="quiz-title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Ej: Capitales del Mundo" className="mt-1 block w-full pl-3 pr-3 py-2 text-base text-blue-950 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" />
                        </div>
                       
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default QuizCrear;