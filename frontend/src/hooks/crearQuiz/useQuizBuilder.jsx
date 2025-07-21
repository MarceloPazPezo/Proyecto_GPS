// hooks/crearQuiz/useQuizBuilder.jsx (Modificado)

import { useState, useMemo, useCallback } from 'react';
import { createNewSlide, createDefaultAnswers, createExtraAnswers } from '../../helpers/quizHelpers';

export const useQuizBuilder = (initialSlides = null) => {
    // ... (el resto del hook hasta handleToggleCorrectAnswer no cambia) ...
    const [slides, setSlides] = useState(() => initialSlides || [createNewSlide('Quiz')]);
    const [activeSlideId, setActiveSlideId] = useState(() => (initialSlides && initialSlides.length > 0) ? initialSlides[0].id : (slides[0]?.id || null));

    const activeSlide = useMemo(
        () => slides.find(s => s.id === activeSlideId) || slides[0],
        [slides, activeSlideId]
    );

    const setAllSlides = useCallback((newSlides) => {
        if (newSlides && newSlides.length > 0) {
            setSlides(newSlides);
            setActiveSlideId(newSlides[0].id);
        } else {
            const initial = [createNewSlide('Quiz')];
            setSlides(initial);
            setActiveSlideId(initial[0].id);
        }
    }, []);

    const addSlide = useCallback((type) => {
        const newSlide = createNewSlide(type);
        setSlides(prev => [...prev, newSlide]);
        setActiveSlideId(newSlide.id);
    }, []);

    const deleteSlide = useCallback((idToDelete) => {
        if (slides.length <= 1) return;
        setSlides(prev => {
            const remaining = prev.filter(s => s.id !== idToDelete);
            if (activeSlideId === idToDelete) {
                setActiveSlideId(remaining[0]?.id || null);
            }
            return remaining;
        });
    }, [activeSlideId]);

    const updateActiveSlide = useCallback((updateFn) => {
        setSlides(prev => prev.map(s => (s.id === activeSlideId ? updateFn(s) : s)));
    }, [activeSlideId]);

    const handleQuestionTextChange = useCallback((text) => {
        updateActiveSlide(slide => ({ ...slide, questionText: text }));
    }, [updateActiveSlide]);
    
    const handleAnswerTextChange = useCallback((answerIndex, text) => {
        updateActiveSlide(slide => {
            const newAnswers = [...slide.answers];
            const targetAnswer = newAnswers[answerIndex];

            targetAnswer.text = text;

            if (targetAnswer.isCorrect && !text.trim()) {
                targetAnswer.isCorrect = false;
            }
            
            return { ...slide, answers: newAnswers };
        });
    }, [updateActiveSlide]);

    // --- CAMBIO PRINCIPAL AQUÍ ---
    const handleToggleCorrectAnswer = useCallback((clickedAnswerIndex) => {
        updateActiveSlide(slide => {
            const clickedAnswer = slide.answers[clickedAnswerIndex];

            // Mantenemos la guarda de seguridad: no se puede marcar una respuesta vacía.
            if (!clickedAnswer || !clickedAnswer.text.trim()) {
                return slide; // No hace ningún cambio
            }

            // La nueva lógica permite múltiples respuestas correctas.
            // Simplemente invertimos el estado 'isCorrect' de la respuesta clickeada.
            const newAnswers = slide.answers.map((answer, index) => {
                if (index === clickedAnswerIndex) {
                    // Si es la respuesta que clickeamos, invertimos su estado.
                    return { ...answer, isCorrect: !answer.isCorrect };
                }
                // Las demás respuestas se quedan como están.
                return answer;
            });

            return { ...slide, answers: newAnswers };
        });
    }, [updateActiveSlide]);

    const toggleExtraAnswers = useCallback(() => {
        updateActiveSlide(slide => {
            if (slide.answers.length > 4) {
                const newAnswers = slide.answers.slice(0, 4);
                return { ...slide, answers: newAnswers };
            } else {
                return { ...slide, answers: [...slide.answers, ...createExtraAnswers()] };
            }
        });
    }, [updateActiveSlide]);


    // Handler para imagen: siempre actualiza el slide activo por id
    const handleImageChange = useCallback((file) => {
        setSlides(prev => prev.map(s =>
            s.id === activeSlideId ? { ...s, imagen: file } : s
        ));
    }, [activeSlideId]);

    return {
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
        handleImageChange,
    };
};