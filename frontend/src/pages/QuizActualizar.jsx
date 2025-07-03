import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Necesitarás react-router-dom

// Servicios y Helpers
//import { getQuizByIdLote, updateQuiz } from '../services/quiz.service.js'; // Asumo que tienes un servicio `updateQuiz`
import { getQuizByIdLote } from '../services/quiz.service.js';
import { transformApiDataToSlides } from '../helpers/quizDataMapper.js';

// Componentes y Hooks
import { useQuizBuilder } from '../hooks/crearQuiz/useQuizBuilder.jsx';
import QuizEditor from '../components/QuizEditor.jsx';
import SlidePreview from '../components/SlidePreview.jsx';

// Este es el mismo JSX que antes, pero ahora vive en un componente separado
// Puedes crear un archivo `QuizBuilderUI.jsx` y ponerlo ahí, o dejarlo aquí.
// Por simplicidad para este ejemplo, lo dejo aquí.

function QuizActualizar() {
    const { id: quizId } = useParams(); // Obtiene el 'id' de la URL
    
    // Estado para la carga inicial y el título
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizTitle, setQuizTitle] = useState('');
    
    const {
        slides,
        activeSlide,
        activeSlideId,
        setActiveSlideId,
        setAllSlides, // Usaremos este para cargar los datos
        addSlide,
        deleteSlide,
        handleQuestionTextChange,
        handleAnswerTextChange,
        handleToggleCorrectAnswer,
        toggleExtraAnswers,
    } = useQuizBuilder(); // Inicia el hook en un estado vacío

    const [isUpdating, setIsUpdating] = useState(false);

    // useEffect para buscar los datos del quiz cuando el componente se monta
    useEffect(() => {
        if (!quizId) {
            setError("No se proporcionó un ID de quiz.");
            setIsLoading(false);
            return;
        }

        const fetchQuizData = async () => {
            try {
                const response = await getQuizByIdLote(quizId);
                if (response.status === 'Success' && response.data) {
                    // Mapeamos los datos de la API a nuestro formato interno
                    const initialSlides = transformApiDataToSlides(response.data);
                    setAllSlides(initialSlides); // Cargamos los datos en nuestro hook
                    // Aquí podrías obtener el título del quiz de otro endpoint si lo tuvieras
                    // setQuizTitle(response.quizTitle);
                } else {
                    throw new Error(response.message || "No se pudieron obtener los datos del quiz.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [quizId, setAllSlides]); // El effect depende del ID del quiz

    // Lógica para el botón "Actualizar"
    const handleUpdate = async () => {
        // ... (Aquí irían tus validaciones, similares a handleSave) ...
        
        setIsUpdating(true);
        try {
            // La lógica de actualización iría aquí, llamando a un servicio
            // await updateQuiz(quizId, { title: quizTitle, slides });
            console.log("Actualizando Quiz:", { quizId, title: quizTitle, slides });
            alert("¡Quiz actualizado exitosamente! (Simulación)");
        } catch (error) {
            alert(`Error al actualizar: ${error.message}`);
        } finally {
            setIsUpdating(false);
        }
    };
    
    if (isLoading) return <div className="flex items-center justify-center h-screen text-2xl">Cargando editor...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-2xl text-red-500">Error: {error}</div>;

    // El resto es la misma UI que en QuizCrear, pero con el botón y la lógica de "Actualizar"
    return (
        <div className="h-screen bg-gray-100 font-sans flex flex-col">
            <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center bg-white p-3 sm:p-2 shadow-sm border-b gap-2 sm:gap-4 z-20">
                <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Editando Quiz</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-gray-200 text-gray-700 rounded-md px-3 py-2 text-sm sm:text-base font-semibold hover:bg-gray-300">Salir</button>
                    <button onClick={handleUpdate} disabled={isUpdating} className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm sm:text-base font-bold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isUpdating ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </header>

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                <div className="order-first w-full lg:w-72 flex-shrink-0 bg-gray-50 border-r flex flex-col overflow-hidden">
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
                    <div className="flex-shrink-0 p-4 space-y-2 border-t bg-gray-50">
                        <button onClick={() => addSlide('Quiz')} className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700">Añadir pregunta</button>
                        <button onClick={() => addSlide('Diapositiva')} className="w-full bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300">Añadir diapositiva</button>
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
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700">Título del Cuestionario</label>
                            <input type="text" id="quiz-title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Ej: Capitales del Mundo" className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default QuizActualizar;