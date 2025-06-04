"use strict";
import {
    createRespuestaService,
    getRespuestaService,
    getRespuestasService,
    updateRespuestaService,
    deleteRespuestaService
} from "../services/respuestas.service.js";

import { 
    handleErrorClient, 
    handleErrorServer, 
    handleSuccess 
} from "../handlers/responseHandlers.js";

import {
    respuestaBodyValidation,
    respuestaQueryValidation
} from "../validations/respuestas.validation.js";

export async function getRespuesta(req, res) {
    try {
        const { id } = req.params;
        const { error } = respuestaQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [respuesta, errorRespuesta] = await getRespuestaService(id);
        if (errorRespuesta) return res.status(404).json({ error: errorRespuesta });
        if (!respuesta) return res.status(204).send();

       handleSuccess(res, 200, "Respuesta encontrada", respuesta);
    } catch (error) {
        console.error("Error al obtener la respuesta:", error);
       handleErrorServer(res, 500, error.message);
    }
}

export async function getRespuestas(req, res) {
    try {
        const { idPreguntas } = req.params;
        const { error } = respuestaQueryValidation.validate({ idPreguntas });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [respuestas, errorRespuestas] = await getRespuestasService(idPreguntas);
        if (errorRespuestas) return res.status(404).json({ error: errorRespuestas });
        if (!respuestas || respuestas.length === 0) return res.status(204).send();

      
        handleSuccess(res, 200, "Respuestas encontradas", respuestas);
    } catch (error) {
        console.error("Error al obtener las respuestas:", error);
         handleErrorServer(res, 500, error.message);
    }
}
export async function createRespuesta(req, res) {
    try {
        const { textoRespuesta, idPreguntas, correcta } = req.body;
        const { error } = respuestaBodyValidation.validate({ textoRespuesta, idPreguntas, correcta });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        

        const [newRespuesta, errorRespuesta] = await createRespuestaService({ textoRespuesta, idPreguntas, correcta });
        if (errorRespuesta) return res.status(500).json({ error: errorRespuesta });
        if (!newRespuesta) return res.status(400).send();

        handleSuccess(res, 201, "Respuesta creada exitosamente", newRespuesta);
    } catch (error) {
        console.error("Error al crear la respuesta:", error);
        handleErrorServer(res, 500, error.message);
    }
}
export async function updateRespuesta(req, res) {
    try {
        const { id } = req.params; 
        const { error } = respuestaQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);
        const {textoRespuesta, correcta} = req.body;
        const { errorBody } = respuestaBodyValidation.validate({ textoRespuesta, correcta });
        if (errorBody) return handleErrorClient(res, 400, "Error de validación", errorBody.message);


        const [updatedRespuesta, errorRespuesta] = await updateRespuestaService({ textoRespuesta, correcta, id });
        if (errorRespuesta) return res.status(404).json({ error: errorRespuesta });
        if (!updatedRespuesta) return res.status(400).send();

       handleSuccess(res, 200, "Respuesta actualizada exitosamente", updatedRespuesta);
    } catch (error) {
        console.error("Error al actualizar la respuesta:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteRespuesta(req, res) {
    try {
        const { id } = req.params;
        const { error } = respuestaQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [deletedRespuesta, errorRespuesta] = await deleteRespuestaService(id);
        if (errorRespuesta) return res.status(404).json({ error: errorRespuesta });
        if (!deletedRespuesta) return res.status(400).send();

        handleSuccess(res, 200, "Respuesta eliminada exitosamente", deletedRespuesta);
    } catch (error) {
        console.error("Error al eliminar la respuesta:", error);
         handleErrorServer(res, 500, error.message);
    }
}