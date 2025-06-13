"use strict";
import {
    createRespuestaService,
    getRespuestaService,
    getRespuestasService,
    updateRespuestaService,
    deleteRespuestaService
} from "../services/respuestas.service.js";

export async function getRespuesta(req, res) {
    try {
        const { id } = req.params;

        const [respuesta, errorRespuesta] = await getRespuestaService(id);
        if (errorRespuesta) return res.status(404).json({ error: errorRespuesta });
        if (!respuesta) return res.status(204).send();

        return res.status(200).json({
            message: "Respuesta encontrada",
            data: respuesta,
        });

    } catch (error) {
        console.error("Error al obtener la respuesta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function getRespuestas(req, res) {
    try {
        const { idPreguntas } = req.params;

        const [respuestas, errorRespuestas] = await getRespuestasService(idPreguntas);
        if (errorRespuestas) return res.status(404).json({ error: errorRespuestas });
        if (!respuestas || respuestas.length === 0) return res.status(204).send();

        return res.status(200).json({
            message: "Respuestas encontradas",
            data: respuestas,
        });

    } catch (error) {
        console.error("Error al obtener las respuestas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}
export async function createRespuesta(req, res) {
    try {
        const { textoRespuesta, idPreguntas, correcta } = req.body;
        console.log("Datos recibidos:", { textoRespuesta, idPreguntas, correcta });

        const [newRespuesta, errorRespuesta] = await createRespuestaService({ textoRespuesta, idPreguntas, correcta });
        if (errorRespuesta) return res.status(500).json({ error: errorRespuesta });
        if (!newRespuesta) return res.status(400).send();

        return res.status(201).json({
            message: "Respuesta creada exitosamente",
            data: newRespuesta,
        });

    } catch (error) {
        console.error("Error al crear la respuesta:", error);
        res.status(500).json({ message: "Error interno del servidor con" });
    }
}
export async function updateRespuesta(req, res) {
    try {
        const { id } = req.params; 
        const {textoRespuesta, correcta} = req.body;

        const [updatedRespuesta, errorRespuesta] = await updateRespuestaService({ textoRespuesta, correcta, id });
        if (errorRespuesta) return res.status(404).json({ error: errorRespuesta });
        if (!updatedRespuesta) return res.status(400).send();

        return res.status(200).json({
            message: "Respuesta actualizada exitosamente",
          
        });

    } catch (error) {
        console.error("Error al actualizar la respuesta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function deleteRespuesta(req, res) {
    try {
        const { id } = req.params;

        const [deletedRespuesta, errorRespuesta] = await deleteRespuestaService(id);
        if (errorRespuesta) return res.status(404).json({ error: errorRespuesta });
        if (!deletedRespuesta) return res.status(400).send();

        return res.status(200).json({
            message: "Respuesta eliminada exitosamente",
            data: deletedRespuesta,
        });

    } catch (error) {
        console.error("Error al eliminar la respuesta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}