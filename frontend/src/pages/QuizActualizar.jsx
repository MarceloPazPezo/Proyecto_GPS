import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Servicios y Helpers
import { getQuizByIdLote, getCuestionariosByUser, updateQuiz } from '../services/quiz.service.js';
import { transformApiDataToSlides } from '../helpers/quizDataMapper.js';
import { showErrorAlert, showSuccessAlert } from '../helpers/sweetAlert.js';

// Componentes y Hooks
import { useQuizBuilder } from '../hooks/crearQuiz/useQuizBuilder.jsx';
import QuizEditor from '../components/QuizEditor.jsx';
import SlidePreview from '../components/SlidePreview.jsx';
import fondoSVG from '../assets/fondo_azul.svg';

function QuizActualizar() {
    const { id: quizId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizTitle, setQuizTitle] = useState('');
    
    const {
        slides,
        activeSlide,
        activeSlideId,
        setActiveSlideId,
        setAllSlides,
        addSlide,
        deleteSlide,
        handleQuestionTextChange,
        handleAnswerTextChange,
        handleToggleCorrectAnswer,
        toggleExtraAnswers,
    } = useQuizBuilder();

    const [isUpdating, setIsUpdating] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // El useEffect para cargar datos iniciales permanece sin cambios.
    useEffect(() => {
        if (!quizId) {
            setError("No se proporcionó un ID de quiz.");
            setIsLoading(false);
            return;
        }

        const fetchQuizData = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem('usuario'));
                if (!user || !user.id) {
                    throw new Error("No se pudo identificar al usuario. Por favor, inicie sesión.");
                }

                const [allUserQuizzes, questionsResponse] = await Promise.all([
                    getCuestionariosByUser(user.id),
                    getQuizByIdLote(quizId)
                ]);

                if (allUserQuizzes && Array.isArray(allUserQuizzes)) {
                    const numericQuizId = Number(quizId);
                    const currentQuiz = allUserQuizzes.find(quiz => quiz.idquiz === numericQuizId);
                    if (currentQuiz) {
                        setQuizTitle(currentQuiz.nombre);
                    } else {
                        throw new Error("El cuestionario no fue encontrado o no pertenece a este usuario.");
                    }
                } else {
                     throw new Error("No se pudieron obtener los detalles del quiz del usuario.");
                }
                
                if (questionsResponse.status === 'Success' && questionsResponse.data) {
                    const initialSlides = transformApiDataToSlides(questionsResponse.data);
                    setAllSlides(initialSlides);
                } else {
                    throw new Error(questionsResponse.message || "No se pudieron obtener las preguntas del quiz.");
                }
            } catch (err) {
                setError(err.message);
                showErrorAlert("Error de carga", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [quizId, setAllSlides]);

    // ===================================================================
    // FUNCIÓN handleUpdate MODIFICADA PARA GENERAR EL JSON CORRECTO
    // ===================================================================
    const handleUpdate = async () => {
        // --- 1. Validaciones (sin cambios) ---
        const errors = {};
        if (!quizTitle.trim()) {
            showErrorAlert('Título requerido', 'Por favor, introduce un título para el cuestionario.');
            return;
        }
        const questionsToValidate = slides.filter(s => s.type === 'Quiz');
        if (questionsToValidate.length === 0) {
            showErrorAlert('Sin preguntas', 'Debes tener al menos una pregunta.');
            return;
        }
        questionsToValidate.forEach(q => {
            const answersWithText = q.answers.filter(a => a.text.trim() !== '');
            const correctAnswers = q.answers.filter(a => a.isCorrect);
            if (!q.questionText.trim()) errors[q.id] = 'no_question_text';
            else if (answersWithText.length < 2) errors[q.id] = 'not_enough_answers';
            else if (correctAnswers.length < 1) errors[q.id] = 'no_correct_answer';
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showErrorAlert('Revisa tu cuestionario', 'Algunas preguntas están incompletas.');
            const firstErrorSlideId = Object.keys(errors)[0];
            setActiveSlideId(firstErrorSlideId);
            return;
        }

        setValidationErrors({});
        setIsUpdating(true);
        
        try {
            // --- 2. Obtener el idUser ---
            const user = JSON.parse(sessionStorage.getItem('usuario'));
            if (!user || !user.id) {
                throw new Error("No se pudo identificar al usuario para guardar. Por favor, inicie sesión de nuevo.");
            }

            // --- 3. Construir el JSON con la estructura exacta que pide el backend ---
            const jsonPayload = {
                idUser: user.id,
                titulo: quizTitle, // La API espera 'titulo'
                preguntas: slides
                    .filter(s => s.type === 'Quiz') // Solo enviar preguntas, no diapositivas
                    .map(slide => ({
                        // Los IDs existentes se envían, los nuevos (que son strings) se omiten
                        id: typeof slide.id === 'number' ? slide.id : undefined,
                        texto: slide.questionText,
                        // La API espera 'Respuestas' (con R mayúscula)
                        Respuestas: slide.answers
                            .filter(a => a.text.trim() !== '') // Solo enviar respuestas con texto
                            .map(answer => ({
                                id: typeof answer.id === 'number' ? answer.id : undefined,
                                textoRespuesta: answer.text, // La API espera 'textoRespuesta'
                                correcta: answer.isCorrect,  // La API espera 'correcta'
                            })),
                    })),
            };

            // Para depuración: puedes ver en la consola el JSON exacto que se envía
            console.log("JSON generado para enviar al backend:", JSON.stringify(jsonPayload, null, 2));

            // --- 4. Llamar al servicio de actualización ---
            await updateQuiz(quizId, jsonPayload);
            
            showSuccessAlert("¡Éxito!", "El quiz ha sido actualizado correctamente.");
            navigate('/biblioteca'); // Opcional: navegar a otra página tras el éxito

        } catch (error) {
            console.error("Error al actualizar:", error);
            showErrorAlert('Error al actualizar', error.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsUpdating(false);
        }
    };
    
    // El resto del componente (renderizado) permanece sin cambios
    if (isLoading) return <div className="flex items-center justify-center h-screen text-2xl">Cargando editor...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-2xl text-red-500">Error: {error}</div>;

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
                        <button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-blue-600 text-white rounded-md px-3 py-3 text-lg font-bold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                            {isUpdating ? 'Actualizando...' : 'Actualizar Quiz'}
                        </button>
                        <button onClick={() => navigate(-1)} className="w-full bg-gray-500 text-white rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-600">
                            Salir
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

export default QuizActualizar;