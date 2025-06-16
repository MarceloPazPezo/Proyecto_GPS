import {
    createCuestionarioService,
    getCuestionarioService,
    getCuestionariosService,
    updateCuestionarioService,
    deleteCuestionarioService,
    addLotepPreguntasService,
    obtenerPreguntasYRespuestas
} from "../services/cuestionario.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

import {
    quizBodyValidation,
    quizQueryValidation
} from "../validations/cuestionario.validation.js";

export async function createCuestionario(req, res) {
    try {
        const { body } = req;
        const { error } = quizBodyValidation.validate(body);

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [newQuiz, errorQuiz] = await createCuestionarioService(body);

        if (errorQuiz) return handleErrorClient(res, 400, "Error creando el cuestionario", errorQuiz);

        return handleSuccess(res, 201, "Cuestionario creado", newQuiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getCuestionario(req, res) {
    try {
        const { idUser, id, nombre } = req.query;
        const { error } = quizQueryValidation.validate({id,idUser,nombre});

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [quiz, errorQuiz] = await getCuestionarioService({ idUser, id, nombre });

        if (errorQuiz) return handleErrorClient(res, 404, errorQuiz);

        handleSuccess(res, 200, "Cuestionario encontrado", quiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getCuestionarios(req, res) {
    try {
        const [quiz, errorQuiz] = await getCuestionariosService();

        if (errorQuiz) return handleErrorClient(res, 404, errorQuiz);

        if (quiz.length === 0) return handleErrorClient(res, 404, errorQuiz)

        handleSuccess(res, 200, "Cuestionario encontrado", quiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateCuestionario(req, res) {
    try {
        const { body } = req;
        const { idUser, nombre, id } = req.query

        const { errorBody } = quizBodyValidation.validate(body);

        if (errorBody) return handleErrorClient(res, 400, "Error de validación", error.message);

        const { errorQuery } = quizQueryValidation.validate({ idUser, nombre, id });

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [updatedQuiz, errorQuiz] = await updateCuestionarioService({id,idUser,nombre}, body);

        if (errorQuiz) return handleErrorClient(res, 400, "Error modificando el cuestionario", errorQuiz);

        handleSuccess(res, 200, "Cuestionario creado", updatedQuiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteCuestionario(req, res) {
    try {
        const { idUser, nombre, id } = req.query

        const { errorQuery } = quizQueryValidation.validate({ idUser, nombre, id });

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [quiz, errorQuiz] = await deleteCuestionarioService({ idUser, nombre, id });

        if (errorQuiz) return handleErrorClient(res, 400, "Error creando el cuestionario", errorQuiz);

        handleSuccess(res, 200, "Cuestionario eliminado correctamente", quiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



import { 
    questionBodyValidation, 
} from "../validations/preguntas.validation.js";

import {
    LoteBodyValidation,
} from "../validations/respuestas.validation.js";

export async function addLotepPreguntas(req, res) {
    try {
        const { idCuestionario } = req.params;
        const preguntasBody = req.body;

        if (!Array.isArray(preguntasBody) || preguntasBody.length === 0) {
            return handleErrorClient(res, 400, "No se recibieron preguntas para agregar");
        }

        // Agrega el idCuestionario a cada pregunta
        const preguntas = preguntasBody.map(p => ({
            ...p,
            idCuestionario: Number(idCuestionario)
        }));

        // Validación de cada pregunta y sus respuestas
        for (const pregunta of preguntas) {
            const { error } = questionBodyValidation.validate({ texto: pregunta.texto, idCuestionario: pregunta.idCuestionario });
            if (error) return handleErrorClient(res, 400, "Error de validación en pregunta", error.message);

            if (!Array.isArray(pregunta.Respuestas) || pregunta.Respuestas.length === 0) {
                return handleErrorClient(res, 400, "Cada pregunta debe tener al menos una respuesta");
            }
            for (const respuesta of pregunta.Respuestas) {
                const { error: errorResp } = LoteBodyValidation.validate(respuesta);
                if (errorResp) return handleErrorClient(res, 400, "Error de validación en respuesta", errorResp.message);
            }
        }

        // Llama al service modificado
        const [result, errorPreguntas] = await addLotepPreguntasService({ preguntas });

        if (errorPreguntas) return res.status(500).json({ error: errorPreguntas });
        if (!result || result.length === 0) return res.status(400).send();

        handleSuccess(res, 201, "Preguntas y respuestas añadidas exitosamente", result);
    } catch (error) {
        console.error("Error al añadir las preguntas y respuestas:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function obtenerPreguntasYRespuestasController(req, res) {
    try {
        const { idCuestionario } = req.params;
        const { error } = quizQueryValidation.validate({ id: idCuestionario });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);
        const [result, errorPreguntas] = await obtenerPreguntasYRespuestas(idCuestionario);
        if (errorPreguntas) return handleErrorClient(res, 404, errorPreguntas);

        if (!result || result.length === 0) return handleErrorClient(res, 404, "No se encontraron preguntas y respuestas para el cuestionario");
        handleSuccess(res, 200, "Preguntas y respuestas obtenidas exitosamente", result);
    }
    catch (error) {
        console.error("Error al obtener las preguntas y respuestas:", error);
        handleErrorServer(res, 500, error.message);
    }
}



        


        