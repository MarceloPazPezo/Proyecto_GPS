import { getQuizzesByUserService } from "../services/EX.service.js";
import { quizUserValidation } from "../validations/cuestionario.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getQuizzesByUser(req, res) {
    try {
        const { idUser } = req.params;
        const { error } = quizUserValidation.validate({idUser});
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);
        const [quizzes, errorQuizzes] = await getQuizzesByUserService(idUser);
        if (errorQuizzes) return handleErrorClient(res, 404, "Error al buscar", errorQuizzes);
        handleSuccess(res, 200, "Cuestionario encontrado", quizzes);
    } catch (error) {
        handleErrorServer(res,500,error.message);
    }
}