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
        const response = await axios.post(`/quiz/addLote/${quizId}`, quizData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

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
        //console.log("Respuesta de getCuestionarios:", response.data);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getCuestionariosByUser(idUser) {
    try {
        const response = await axios.get(`/EX/quizzes/${idUser}`)
        //console.log("Respuesta de getCuestionariosByUser:", response.data);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}

export async function eliminarQuiz(Quiz) {
    try {
        //console.log("Eliminando quiz:", Quiz);
        const response = await axios.delete("/quiz/", { data: Quiz });
        return response.data;
    } catch (error) {
        console.error(error);
        return;
    }
}

export async function updateQuiz(idquiz, quiz) {
    try {
        console.log("Actualizando quiz:", quiz);
        let config = {};
        
        // Si quiz es FormData, configuramos el header adecuado
        if (quiz instanceof FormData) {
            config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
        }
        
        const response = await axios.patch(`/quiz/lote/${idquiz}`, quiz, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response?.data || new Error("Error al actualizar el quiz");
    }
}

export async function registrarSesion(idUser,idquiz){
    try {
        const res=await axios.post("/sesion",{idUser:idUser,idCuestionario:idquiz});
        return res.data;
    } catch (error) {
        console.error(error);
        return error;
    }
}