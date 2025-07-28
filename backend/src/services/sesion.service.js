"use strict";
import Sesion from "../entity/sesion.entity.js";
import { AppDataSource } from "../config/configDb.js"

export async function createSesionService(data) {
    try{
        const SesionRepository = AppDataSource.getRepository(Sesion);
        const { idCuestionario, idUser } = data;
        const newSesion = SesionRepository.create({
            idCuestionario: idCuestionario, idUser: idUser
        });
        await SesionRepository.save(newSesion);
        const { ...dataSesion } = newSesion;
        return [ dataSesion, null];
    }catch(error){
        console.error("Error al crear la sesion:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getSesionService(query) {
    try{
        const { idCuestionario, idUser } = query;
        const SesionRepository = AppDataSource.getRepository(Sesion);
        const SesionFound = await SesionRepository.findOne({
            where: { idCuestionario: idCuestionario, idUser:idUser },
        });
        if(!SesionFound) return [null, "Sesion no encontrada"];
        return [SesionFound, null];
    }catch(error){
        console.error("Error al obtener la  sesion solicitada", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getSesionesService() {
    try{
        const SesionRepository = AppDataSource.getRepository(Sesion);
        const sesiones = await SesionRepository.find();
        if (!sesiones || sesiones.length === 0) return [null, "No hay sesiones"];
        return [sesiones,null];
    }catch(error){
        console.error("Error al obtener todas las sesiones",error);
        return [null,"Error interno del servidor"];
    }
}