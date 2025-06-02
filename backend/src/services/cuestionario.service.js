import Cuestionario from "../entity/cuestionario.entity.js";
import { AppDataSource } from "../config/configDb.js";

const cuestRepository = AppDataSource.getRepository(Cuestionario);

export async function createCuestionarioService(data) {
    try {
        const { idUser, nombre } = data;
        const existing = await cuestRepository.findOne({
            where: [{ idUser: idUser }, { nombre: nombre }]
        });

        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });

        if (existing) {
            return [null, createErrorMessage("nombre", "Ese cuestionario ya existe")];
        }

        const newCuest = cuestRepository.create({
            idUser: idUser,
            nombre: nombre
        });

        await cuestRepository.save(newCuest);

        return [newCuest, null];

    } catch (error) {
        console.error("Error al crear", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCuestionariosService() {
    try {
        const cuestFound = await cuestRepository.find();
        if (!cuestFound) {
            return [null, "No se encontraron cuestionarios"];
        }
        return [cuestFound, null];
    } catch (error) {
        console.error("Error al buscar", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCuestionarioService(data) {
    try {
        const { idUser, nombre, id } = data
        const cuestFound = await cuestRepository.findOne({
            where: [{ idUser: idUser }, { nombre: nombre }, { id: id }]
        });

        if (!cuestFound) return [null, "No se encontro el cuestionario"];

        return [cuestFound, null];
    } catch (error) {
        console.error("Error al buscar", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateCuestionarioService(query, body) {
    try {
        const { idUser, nombre, id } = query;
        const cuestFound = await cuestRepository.findOne({
            where: [{ idUser }, { id: id }, { nombre: nombre }]
        });
        if (!cuestFound) return [null, "El cuestionario no existe"];
        
        const cuestUpdate = {
            idUser: body.idUser,
            nombre: body.nombre
        }

        await cuestRepository.update({ id: cuestFound.id }, cuestUpdate);

        const updatedCuest = await cuestRepository.findOne({where:[ {id: cuestFound.id} ]});

        if (!updatedCuest) return [null, "No se encontro tras actualizacion"];

        return [updatedCuest, null];
    } catch (error) {
        console.error("Error al modificar", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteCuestionarioService(data) {
    try {
        const { idUser, id, nombre } = data;
        const cuestFound = await cuestRepository.findOne({
            where: [{ idUser: idUser }, { id: id }, { nombre: nombre }]
        });

        if (!cuestFound) return [null, "El cuestionario no existe"];

        const deletedCuest = await cuestRepository.delete(cuestFound.id);

        return [deletedCuest, null];
    } catch (error) {
        console.error("Error al eliminar", error);
        return [null, "Error interno del servidor"];
    }
}