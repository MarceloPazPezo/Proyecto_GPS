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
        //console.log("Respuesta de addQuizPreguntas:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error en addQuizPreguntas:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function getQuizByIdLote(quizId) {
    try {
        //console.log("Obteniendo quiz con ID:", quizId);
        const response = await axios.get(`/quiz/lote/${quizId}`);
        //console.log("Respuesta de getQuizByIdLote:", response.data);
        return response.data; // Devolvemos el cuerpo de la respuesta.

    } catch (error) {
        //console.log("Error al obtener el quiz por ID:", error);
        console.error("Error en getQuizByIdLote:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function getCuestionarios(idUser) {
    try {
        const response = await axios.get(`/quiz/user/${idUser}`)
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getCuestionariosByUser(idUser) {
    try {
        const response = await axios.get(`/EX/quizzes/${idUser}`)
        return response.data.data;
    } catch (error) {
        console.error(error.status);
    }
}

export async function eliminarQuiz(Quiz){
    try {
        const response= await axios.delete("/quiz/",{idUser:Quiz.idUser,nombre:Quiz.nombre,id:Quiz.id});
        return response.data;
    } catch (error) {
        console.error(error)
        return;
    }
}