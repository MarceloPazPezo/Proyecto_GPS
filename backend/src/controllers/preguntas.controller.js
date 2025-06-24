"use strict";
import {
    createPreguntaService,
    getPreguntaService,
    getPreguntasService,
    updatePreguntaService,
    deletePreguntaService,
} from "../services/preguntas.service.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

import { 
    questionBodyValidation, 
    questionQueryValidation 
} from "../validations/preguntas.validation.js";



export async function getPregunta(req, res) {
    try {
        const { id } = req.params;
        const { error } = questionQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);


        const [pregunta, errorPregunta] = await getPreguntaService(id);
        if (errorPregunta) return res.status(404).json({ error: errorPregunta });
        if (!pregunta) return res.status(204).send();
                
        handleSuccess(res, 200, "Pregunta encontrada", pregunta);

    } catch (error) {
        console.error("Error al obtener la pregunta:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function getPreguntas(req, res) {
    try {
        const { idCuestionario } = req.params;
        const { error } = questionQueryValidation.validate({ idCuestionario });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [preguntas, errorPreguntas] = await getPreguntasService(idCuestionario);
        if (errorPreguntas) return res.status(404).json({ error: errorPreguntas });
        if (!preguntas || preguntas.length === 0) return res.status(204).send();

        handleSuccess(res, 200, "Preguntas encontradas", preguntas);
    } catch (error) {
        console.error("Error al obtener las preguntas:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function createPregunta(req, res) {
    try {
        const { texto, idCuestionario } = req.body;
        const fileData = req.file;

        const { error } = questionBodyValidation.validate({ texto, idCuestionario });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        
        const [newPregunta, errorPregunta] = await createPreguntaService({ texto, idCuestionario }, fileData);
        if (errorPregunta) return res.status(500).json({ error: errorPregunta });   
        if (!newPregunta) return res.status(400).send();


        handleSuccess(res, 201, "Pregunta creada exitosamente", newPregunta);
    }catch (error) {
        console.error("Error al crear la pregunta:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function updatePregunta(req, res) {
    try {
        const { id } = req.params;
        const { error } = questionQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const { texto } = req.body;
        const { errorbody } = questionBodyValidation.validate({ texto });
        if (errorbody) return handleErrorClient(res, 400, "Error de validación", errorbody.message);

        const fileData = req.file;
        const [updatedPregunta, errorPregunta] = await updatePreguntaService({ id, texto }, fileData);
        if (errorPregunta) return res.status(404).json({ error: errorPregunta });
        if (!updatedPregunta) return res.status(400).send();

        handleSuccess(res, 200, "Pregunta actualizada exitosamente", updatedPregunta);
    } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function deletePregunta(req, res) {
    try {
        const { id } = req.params;
        const { error } = questionQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [deletedPregunta, errorPregunta] = await deletePreguntaService( id );
        if (errorPregunta) return res.status(404).json({ error: errorPregunta });
        if (!deletedPregunta) return res.status(400).send();

       handleSuccess(res, 200, "Pregunta eliminada exitosamente", deletedPregunta);
    } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
        handleErrorServer(res, 500, error.message);
    }
}
