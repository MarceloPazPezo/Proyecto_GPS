import {
    createCuestionarioService,
    getCuestionarioService,
    getCuestionariosService,
    updateCuestionarioService,
    deleteCuestionarioService,
    addLotepPreguntasService,
    obtenerPreguntasYRespuestas,
    actualizarCuestionarioCompletoService,
    elimnarALLpreguntas,

    //ModLotepPreguntasService,
    getCuestionariosByUserService
} from "../services/cuestionario.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

import {
    quizBodyValidation,
    quizQueryValidation,
    quizUserValidation
} from "../validations/cuestionario.validation.js";

import {
    questionBodyValidation,
} from "../validations/preguntas.validation.js";

import {
    LoteBodyValidation,
} from "../validations/respuestas.validation.js";

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
        const { error } = quizQueryValidation.validate({ id, idUser, nombre });

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [quiz, errorQuiz] = await getCuestionarioService({ idUser, id, nombre });

        if (errorQuiz) return handleErrorClient(res, 404, errorQuiz);

        handleSuccess(res, 200, "Cuestionario encontrado", quiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getCuestionariosByUser(req, res) {
    try {
        const { idUser } = req.params;

        const { error } = quizUserValidation.validate({ idUser });

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [quiz, errorQuiz] = await getCuestionariosByUserService(idUser);

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

        const { error: errorBody } = quizBodyValidation.validate(body);

        if (errorBody) return handleErrorClient(res, 400, "Error de validación", errorBody.message);

        const { error: errorQuery } = quizQueryValidation.validate({ idUser, nombre, id });

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [updatedQuiz, errorQuiz] = await updateCuestionarioService({ id, idUser, nombre }, body);

        if (errorQuiz) return handleErrorClient(res, 400, "Error modificando el cuestionario", errorQuiz);

        handleSuccess(res, 200, "Cuestionario creado", updatedQuiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteCuestionario(req, res) {
    try {
        const { idUser, nombre, id } = req.body

        const { error: errorQuery } = quizQueryValidation.validate({ idUser, nombre, id });

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [quiz, errorQuiz] = await deleteCuestionarioService({ idUser, nombre, id });

        if (errorQuiz) return handleErrorClient(res, 400, "Error creando el cuestionario", errorQuiz);

        handleSuccess(res, 200, "Cuestionario eliminado correctamente", quiz);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function addLotepPreguntas(req, res) {
    try {
        const { idCuestionario } = req.params;

        // Si viene como string, parsear
        let preguntasBody = req.body;
        if (typeof preguntasBody === 'string') {
            preguntasBody = JSON.parse(preguntasBody);
        }
        if (typeof preguntasBody.preguntas === 'string') {
            preguntasBody = JSON.parse(preguntasBody.preguntas);
        } else if (preguntasBody.preguntas) {
            preguntasBody = preguntasBody.preguntas;
        }

        if (!Array.isArray(preguntasBody) || preguntasBody.length === 0) {
            // Permitir guardar lote vacío (sin preguntas)
            return handleSuccess(res, 201, "No se recibieron preguntas para agregar, lote vacío procesado", []);
        }

        // Asociar imágenes ya subidas por Multer/MinIO a cada pregunta
        const preguntas = [];
        for (const p of preguntasBody) {
            let imagenUrl = null, imagenKey = null;
            if (p.imagenField) {
                const file = req.files?.find(f => f.fieldname === p.imagenField);
                if (file) {
                    imagenUrl = file.location;
                    imagenKey = file.key;
                }
            }
            preguntas.push({
                ...p,
                idCuestionario: Number(idCuestionario),
                imagenUrl,
                imagenKey
            });
        }

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


//actualizar quiz enterito

    export async function actualizarPreguntasYRespuestasController(req, res) {
    try {
        const { idCuestionario } = req.params;
        let jsonData;

        // Verificar si los datos vienen como FormData o como JSON directo
        if (req.body.data) {
            // Si hay un campo 'data', parsear el JSON desde ahí
            try {
                jsonData = JSON.parse(req.body.data);
            } catch (parseError) {
                return handleErrorClient(res, 400, "Error de formato", "Los datos JSON en el campo 'data' no son válidos");
            }
        } else {
            // Si no hay campo 'data', los datos JSON están directamente en req.body
            jsonData = req.body;
        }

        console.log("Datos recibidos para actualizar preguntas y respuestas:", jsonData);
        const { idUser, titulo, preguntas } = jsonData;

        // Validar que preguntas sea un array
        if (!Array.isArray(preguntas)) {
            return handleErrorClient(res, 400, "Error de formato", "El campo 'preguntas' debe ser un array");
        }

        // 1. Validación de la entrada
        const { error } = quizQueryValidation.validate({ id: idCuestionario, idUser, nombre: titulo });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // 2. Procesar las imágenes si existen
        if (req.files && req.files.length > 0) {
            // Asociar cada archivo con su pregunta correspondiente
            for (const file of req.files) {
                // Buscar la pregunta que tiene este imagenField
                const preguntaIndex = preguntas.findIndex(p => p.imagenField === file.fieldname);
                if (preguntaIndex !== -1) {
                    // Agregar la información de la imagen a la pregunta
                    preguntas[preguntaIndex].imagenUrl = file.location;
                    preguntas[preguntaIndex].imagenKey = file.key;
                }
            }
        }

        for (const pregunta of preguntas) {
            // Si imagenField es null (imagen eliminada) o no existe, asegurarse de que imagenUrl y imagenKey sean null
            if (!pregunta.imagenField) {
                pregunta.imagenUrl = null;
                pregunta.imagenKey = null;
            }
            // Si no se actualizó con un archivo nuevo pero tenía una URL anterior, mantenerla
            // Esto ya está manejado implícitamente porque no modificamos estos campos
        }
        // 3. Preparamos el objeto de datos para el servicio
        const serviceData = {
            cuestionarioData: {
                idUser,
                nombre: titulo
            },
            preguntasData: preguntas
        };

        // 4. Llamamos al servicio transaccional
        const [resultado, errorService] = await actualizarCuestionarioCompletoService(idCuestionario, serviceData);
        
        // 5. Manejamos la respuesta del servicio
        if (errorService) {
            if (errorService.includes("no existe")) {
                return handleErrorClient(res, 404, "No encontrado", errorService);
            }
            return handleErrorClient(res, 500, "Error al actualizar el cuestionario", errorService);
        }

        // 6. Respondemos con éxito
        handleSuccess(res, 200, "Cuestionario actualizado exitosamente", resultado);

    } catch (error) {
        console.error("Error en el controlador al actualizar preguntas y respuestas:", error);
        handleErrorServer(res, 500, "Error inesperado en el servidor.");
    }
}






