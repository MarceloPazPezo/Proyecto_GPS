"use strict";
import Respuesta from "../entity/respuesta.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getRespuestaService(id) {
    try {
        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const respuestaFound = await respuestaRepository.findOne({
            where: [{ id: id }],
        });

        if (!respuestaFound) return [null, "Respuesta no encontrada"];

        const { ...respuestaData } = respuestaFound;
        console.log(respuestaData," a ", respuestaFound );
        return [respuestaData, null];

    } catch (error) {
        console.error("Error al obtener la respuesta:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getRespuestasService(idPreguntas) {
    try {
        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const respuestas = await respuestaRepository.find({
            where: { idPreguntas: idPreguntas },
        });
        if (!respuestas || respuestas.length === 0) return [null, "No hay respuestas"];
        const respuestasData = respuestas.map(({ ...respuesta }) => respuesta);
        return [respuestasData, null];
    } catch (error) {
        console.error("Error al obtener las respuestas:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function createRespuestaService(query) {
    try{
    const { textoRespuesta, idPreguntas, correcta } = query;
    const respuestaRepository = AppDataSource.getRepository(Respuesta);
    const newRespuesta = respuestaRepository.create({ textoRespuesta, idPreguntas, correcta });

    const savedRespuesta = await respuestaRepository.save(newRespuesta);
    return [savedRespuesta, null];
    }catch (error) {
        console.error("Error al crear la respuesta:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateRespuestaService(query) {
    try {
        const { textoRespuesta, correcta,id } = query;
   

        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const updatedRespuesta = await respuestaRepository.findOne({
            where: { id: id },
        });

        if (!updatedRespuesta) return [null, "Respuesta no encontrada"];

        updatedRespuesta.textoRespuesta = textoRespuesta;
        updatedRespuesta.correcta = correcta;
        

        const savedUpdatedRespuesta = await respuestaRepository.update({id:updatedRespuesta.id},updatedRespuesta);
        return [savedUpdatedRespuesta, null];
    } catch (error) {
        console.error("Error al actualizar la respuesta:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteRespuestaService(id) {
    try {
        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const respuestaToDelete = await respuestaRepository.findOne({
            where: { id: id },
        });

        if (!respuestaToDelete) return [null, "Respuesta no encontrada"];

        await respuestaRepository.remove(respuestaToDelete);
        return [respuestaToDelete, null];
    } catch (error) {
        console.error("Error al eliminar la respuesta:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function addLotepRespuestasService(query) {
    try {

        const {respuestas} = query;

        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const nuevasRespuestas = respuestaRepository.create(respuestas);
        const savedRespuestas = await respuestaRepository.save(nuevasRespuestas);

        return [savedRespuestas, null];
    }
    catch (error) {
        console.error("Error al agregar respuestas:", error);
        return [null, "Error interno del servidor"];
    }
}

