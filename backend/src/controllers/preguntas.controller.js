"use strict";
import {
    createPreguntaService,
    getPreguntaService,
    getPreguntasService,
    updatePreguntaService,
    deletePreguntaService
} from "../services/preguntas.service.js";

export async function getPregunta(req, res) {
    try {
        const { id } = req.params;
      

        const [pregunta, errorPregunta] = await getPreguntaService(id);
        if (errorPregunta) return res.status(404).json({ error: errorPregunta });
        if (!pregunta) return res.status(204).send();
                
        return res.status(200).json({
            message: "Pregunta encontrada",
            data: pregunta,
        });


    } catch (error) {
        console.error("Error al obtener la pregunta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function getPreguntas(req, res) {
    try {
        const { idCuestionario } = req.query;

        const [preguntas, errorPreguntas] = await getPreguntasService(idCuestionario);
        if (errorPreguntas) return res.status(404).json({ error: errorPreguntas });
        if (!preguntas || preguntas.length === 0) return res.status(204).send();

        return res.status(200).json({
            message: "Preguntas encontradas",
            data: preguntas,
        });

    } catch (error) {
        console.error("Error al obtener las preguntas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function createPregunta(req, res) {
    try {
        const { texto, idCuestionario } = req.body;
        
        const [newPregunta, errorPregunta] = await createPreguntaService({ texto, idCuestionario });
        if (errorPregunta) return res.status(500).json({ error: errorPregunta });   
        if (!newPregunta) return res.status(400).send();
        return res.status(201).json({
            message: "Pregunta creada exitosamente",
            data: newPregunta,
        });
    }catch (error) {
        console.error("Error al crear la pregunta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function updatePregunta(req, res) {
    try {
        const { id } = req.params;
        const { texto } = req.body;

        const [updatedPregunta, errorPregunta] = await updatePreguntaService({ id, texto });
        if (errorPregunta) return res.status(404).json({ error: errorPregunta });
        if (!updatedPregunta) return res.status(400).send();

        return res.status(200).json({
            message: "Pregunta actualizada exitosamente",
            
        });
    } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function deletePregunta(req, res) {
    try {
        const { id } = req.params;
        console.log("ID de la pregunta a eliminar:", id);

        const [deletedPregunta, errorPregunta] = await deletePreguntaService( id );
        if (errorPregunta) return res.status(404).json({ error: errorPregunta });
        if (!deletedPregunta) return res.status(400).send();

        return res.status(200).json({
            message: "Pregunta eliminada exitosamente",
            data: deletedPregunta,
        });
    } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
        res.status(500).json({ message: "Error interno del servidor controller" });
    }
}