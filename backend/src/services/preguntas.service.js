"use strict";
import Pregunta from "../entity/preguntas.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { deleteFile } from "../services/minio.service.js";

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

export async function createPreguntaService(query, fileData) {
    const {texto, idCuestionario} = query;
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
                const newPreguntaData = {
            texto,
            idCuestionario
        };

        if (fileData) {
            newPreguntaData.imagenUrl = fileData.location;
            newPreguntaData.imagenKey = fileData.key;
        }

        const newPregunta = preguntaRepository.create(newPreguntaData);

        const savedPregunta = await preguntaRepository.save(newPregunta);
        return [savedPregunta, null];
    } catch (error) {
        console.error("Error al crear la pregunta:", error);
        if (fileData?.key) {
            console.log(`Error de BBDD. Revirtiendo subida de archivo: ${fileData.key}`);
            await deleteFile(fileData.key);
        }
        return [null, "Error interno del servidor"];
    }
}

export async function updatePreguntaService(query, fileData) {
    try {
        const { id, texto } = query;
        
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const updatedPregunta = await preguntaRepository.findOne({
            where: { id: id },
        });
        if (!updatedPregunta) {
            if (fileData) await deleteFile(fileData.key);
            return [null, "Pregunta no encontrada"];
        }
        const oldImageKey = updatedPregunta.imagenKey;
        if (texto) updatedPregunta.texto = texto;
        if (fileData) {
            updatedPregunta.imagenUrl = fileData.location;
            updatedPregunta.imagenKey = fileData.key;
        }

        const savedPregunta = await preguntaRepository.update({id:updatedPregunta.id},updatedPregunta);
        
        if (fileData && oldImageKey) await deleteFile(oldImageKey);
        return [savedPregunta, null];

    } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
        if (fileData?.key) {
            console.log(`Error de BBDD. Revirtiendo subida de archivo: ${fileData.key}`);
            await deleteFile(fileData.key);
        }
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
        
        const imageKeyToDelete = preguntaFound.imagenKey;

        await preguntaRepository.remove(preguntaFound);
        if (imageKeyToDelete) {
            const [success, error] = await deleteFile(imageKeyToDelete);
            if (!success) {
                console.warn(`La pregunta ${id} fue eliminada de la BBDD, pero no se pudo eliminar su imagen '${imageKeyToDelete}' de Minio. Error: ${error}`);
            }
        }
        return [preguntaFound, null];
    } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
        return [null, "Error interno del servidor"];
    }

}
