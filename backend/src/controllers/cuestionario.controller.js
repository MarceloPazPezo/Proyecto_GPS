import {
    createCuestionarioService,
    getCuestionarioService,
    getCuestionariosService,
    updateCuestionarioService,
    deleteCuestionarioService
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