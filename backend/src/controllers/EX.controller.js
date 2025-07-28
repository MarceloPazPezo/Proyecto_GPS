import { getQuizzesByUserService } from "../services/EX.service.js";
import { quizUserValidation } from "../validations/cuestionario.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import { getUserService } from "../services/user.service.js";
import { userQueryValidation } from "../validations/user.validation.js";


export async function getQuizzesByUser(req, res) {
    try {
        const { idUser } = req.params;
        const { error } = quizUserValidation.validate({ idUser });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);
        const [quizzes, errorQuizzes] = await getQuizzesByUserService(idUser);
        if (errorQuizzes) return handleErrorClient(res, 404, "Error al buscar", errorQuizzes);
        handleSuccess(res, 200, "Cuestionario encontrado", quizzes);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function join(req, res) {
    try {
        const { rut,id,email } = req.body;
        const { error } = userQueryValidation.validate({ rut, id, email });

        if (error) return handleErrorClient(res, 400, error.message);

        const [user, errorUser] = await getUserService({ rut, id, email });

        if (errorUser) return handleErrorClient(res, 404, errorUser);

        handleSuccess(res, 200, "Usuario encontrado", user.nombreCompleto);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}