"use strict";
import Compartido from "../entity/compartido.entity.js";
import { AppDataSource } from "../config/configDb";

export async function getCompartidoService(query) { 
    try{
        const { idCuestionario, idUsuario } = query;
        const CompartidoRepository = AppDataSource.getRepository(Compartido);
        const compartidoFound = await CompartidoRepository.findOne({
            where: { idCuestionario:idCuestionario, idUser:idUsuario },
        });
        if (!compartidoFound) return [null, "Instancia compartida no encontrada"];
        return [compartidoFound, null];
    }catch (error){
        console.error("Error al obtener el archivo compartido",error);
        return [null,"Error interno del servidor"];
    }
}

export async function getCompartidosService() {
    try{
        const CompartidoRepository = AppDataSource.getRepository(Compartido);
        const compartidos = await CompartidoRepository.find();
        if(!compartidos || compartidos.length === 0) return [null, "No hay compartidos"];
        return [compartidos,null];
    } catch (error){
        console.error("Error al obtener todos los compartidos:", error);
        return [null,"Error interno del servidor"];
    }
    
}

export async function createCompartidoService(Compartido) {
    try{
        const CompartidoRepository = AppDataSource.getRepository(Compartido);
        const { idCuestionario, idUser } = compartido;
        const newCompartido = CompartidoRepository.create({
            idCuestionario: idCuestionario, idUser: idUser
        });
        await CompartidoRepository.save(newCompartido);
        const { ...dataCompartido } = newCompartido;
        return [ dataCompartido,null ];
    } catch (error){
        console.error("Error al crear el compartido:", error);
        return [null, "Error interno del servidor"];
    }
}