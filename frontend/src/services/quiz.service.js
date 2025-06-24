import axios from './root.service.js';

export async function crearQuiz(data) {
    try {
        // La data de la respuesta de axios está en la propiedad `data`.
        const response = await axios.post('/quiz/', data);
        return response.data; // Devolvemos el cuerpo de la respuesta.

    } catch (error) {
        console.error("Error en crearQuiz:", error.response?.data || error.message);
        // Propagamos el error para que el componente pueda manejarlo.
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}


export async function addQuizPreguntas(quizData, quizId) {
    try {
        const response = await axios.post(`/quiz/addLote/${quizId}`, quizData);
        console.log("Respuesta de addQuizPreguntas:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error en addQuizPreguntas:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}