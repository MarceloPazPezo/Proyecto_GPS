import { useState, useMemo, useCallback } from 'react'; // <-- 1. Importar useCallback
import { createNewSlide, createDefaultAnswers, createExtraAnswers } from '../../helpers/quizHelpers';

export const useQuizBuilder = (initialSlides = null) => {
    const [slides, setSlides] = useState(() => initialSlides || [createNewSlide('Quiz')]);
    const [activeSlideId, setActiveSlideId] = useState(() => slides[0]?.id || null);

    const activeSlide = useMemo(
        () => slides.find(s => s.id === activeSlideId) || slides[0],
        [slides, activeSlideId]
    );

    // --- 2. Envolver TODAS las funciones que se retornan en useCallback ---

    // Las funciones `setSlides` y `setActiveSlideId` de useState son estables por defecto,
    // así que no necesitamos incluirlas en los arrays de dependencias de useCallback.
    // Solo las variables/estado que leemos (como `activeSlideId`) son necesarias.

    const setAllSlides = useCallback((newSlides) => {
        if (newSlides && newSlides.length > 0) {
            setSlides(newSlides);
            setActiveSlideId(newSlides[0].id);
        }
    }, []); // Array vacío porque solo usa setters de estado, que son estables.

    const addSlide = useCallback((type) => {
        const newSlide = createNewSlide(type);
        setSlides(prev => [...prev, newSlide]);
        setActiveSlideId(newSlide.id);
    }, []);

    const deleteSlide = useCallback((idToDelete) => {
        if (slides.length <= 1) return; // Podemos leer `slides.length` sin que sea dependencia
        setSlides(prev => {
            const remaining = prev.filter(s => s.id !== idToDelete);
            if (activeSlideId === idToDelete) {
                // `activeSlideId` es leído aquí, así que debe ser una dependencia
                setActiveSlideId(remaining[0]?.id || null);
            }
            return remaining;
        });
    }, [activeSlideId]); // <-- Dependencia necesaria

    const updateActiveSlide = useCallback((updateFn) => {
        setSlides(prev => prev.map(s => (s.id === activeSlideId ? updateFn(s) : s)));
    }, [activeSlideId]); // <-- Dependencia necesaria

    const handleQuestionTextChange = useCallback((text) => {
        updateActiveSlide(slide => ({ ...slide, questionText: text }));
    }, [updateActiveSlide]);

    const handleAnswerTextChange = useCallback((answerIndex, text) => {
        updateActiveSlide(slide => {
            const newAnswers = [...slide.answers];
            newAnswers[answerIndex].text = text;
            return { ...slide, answers: newAnswers };
        });
    }, [updateActiveSlide]);

    const handleToggleCorrectAnswer = useCallback((clickedAnswerIndex) => {
        updateActiveSlide(slide => {
            const newAnswers = slide.answers.map((answer, index) => ({
                ...answer,
                isCorrect: index === clickedAnswerIndex,
            }));
            return { ...slide, answers: newAnswers };
        });
    }, [updateActiveSlide]);

    const toggleExtraAnswers = useCallback(() => {
        updateActiveSlide(slide => {
            const hasExtras = slide.answers.length > 4;
            const newAnswers = hasExtras ? createDefaultAnswers() : [...slide.answers, ...createExtraAnswers()];
            return { ...slide, answers: newAnswers };
        });
    }, [updateActiveSlide]);


    return {
        slides,
        activeSlide,
        activeSlideId,
        setActiveSlideId, // El setter de useState es estable, no necesita useCallback
        setAllSlides,
        addSlide,
        deleteSlide,
        handleQuestionTextChange,
        handleAnswerTextChange,
        handleToggleCorrectAnswer,
        toggleExtraAnswers,
    };
};