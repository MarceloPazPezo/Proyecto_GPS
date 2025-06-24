"use strict";
import Pregunta from "../entity/preguntas.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getPreguntaService(id) {
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const preguntaFound = await preguntaRepository.findOne({
            where: [{ id: id }],
        });
        
        if (!preguntaFound) return [null, "Pregunta no encontrada"];
        
        const { ...preguntaData } = preguntaFound;
        return [preguntaData, null];

    } catch (error) {
        console.error("Error al obtener la pregunta:", error);
        return [null, "Error interno del servidor"];
    }

}

export async function getPreguntasService(idCuestionario){
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const preguntas = await preguntaRepository.find({
            where: { idCuestionario: idCuestionario },
           
        });
        if (!preguntas || preguntas.length === 0) return [null, "No hay preguntas"];
        const preguntasData = preguntas.map(({ ...pregunta }) => pregunta);
        return [preguntasData, null];
    } catch (error) {
        console.error("Error al obtener las preguntas:", error);
        return [null, "Error interno del servidor"];
    }
        
}

export async function createPreguntaService(query) {
    const {texto, idCuestionario} = query;
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const newPregunta = preguntaRepository.create({texto, idCuestionario});

        const savedPregunta = await preguntaRepository.save(newPregunta);
        return [savedPregunta, null];
    } catch (error) {
        console.error("Error al crear la pregunta:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updatePreguntaService(query) {
    try {
        const { id, texto } = query;
        
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const updatedPregunta = await preguntaRepository.findOne({
            where: { id: id },
        });
        if (!updatedPregunta) return [null, "Pregunta no encontrada"];

        updatedPregunta.texto = texto;

        const savedPregunta = await preguntaRepository.update({id:updatedPregunta.id},updatedPregunta);
        
        return [savedPregunta, null];

    } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
        return [null, "Error interno del servidor"];
    }

}

export async function deletePreguntaService(id) {
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const preguntaFound = await preguntaRepository.findOne({
            where: { id: id },
        });
        if (!preguntaFound) return [null, "Pregunta no encontrada"];
        await preguntaRepository.remove(preguntaFound);
        return [preguntaFound, null];
    } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
        return [null, "Error interno del servidor"];
    }

}
