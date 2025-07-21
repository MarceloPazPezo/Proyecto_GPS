"use strict";
import { AppDataSource } from "../config/configDb.js";
import Mural from "../entity/mural.entity.js";
import User from "../entity/user.entity.js";

const MuralRepository = AppDataSource.getRepository(Mural);
const UserRepository = AppDataSource.getRepository(User);

export async function createMuralService(data) {
    try {
        const { usuario, titulo } = data;

        const userFound = await UserRepository.findOne({
            where: { id: usuario }
        });

        if (!userFound) return [null, "Usuario no encontrado"];

        const existing = await MuralRepository.findOne({
            where: {
                titulo: titulo,
                idUser:  usuario,
            }
        });
        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });
        if (existing) {
            return [null, createErrorMessage("nombre", "Ya existe un mural con ese nombre para este usuario")];
        }
        const newMural = MuralRepository.create({
            titulo,
            idUser: usuario,
        });

        await MuralRepository.save(newMural);

        return [newMural, null];
    } catch (error) {
        console.error("Error al crear el mural", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getMuralService(id) {
    try {
        const mural = await MuralRepository.findOne({
            where: { id: id },
        });

        if (!mural) return [null, "Mural no encontrado"];

        return [mural, null];

    } catch (error) {
        console.error("Error al obtener mural:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getMuralesByUserService(idUser) {
    try {
        const murales = await MuralRepository.find({
            where: { idUser: { id: idUser } }
        });

        if (!murales || murales.length === 0) 
            return [[], "No se encontraron murales para este usuario"]

        return [murales, null];

    } catch (error) {
        console.error("Error al obtener los murales del usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateMuralService(query, body) {
    try {
        const {   id } = query;
        const muralFound = await MuralRepository.findOne({
            where: {
                id: id
            }
        });

        if (!muralFound) return [null, "Mural no encontrado"];

        const muralUpdate = {
            titulo: body.titulo || muralFound.titulo,
        };

        await MuralRepository.update({ id: id }, muralUpdate);

        const updatedMural = await MuralRepository.findOne({ where: { id: id } });

        return [updatedMural, null];

    } catch (error) {
        console.error("Error al actualizar mural:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteMuralService(data) {
    try {
        const {  id, titulo } = data;

        const muralFound = await MuralRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!muralFound) return [null, "Mural no encontrado o no autorizado"];

        const deletedMural = await MuralRepository.delete(muralFound.id);

        return [deletedMural, null];

    } catch (error) {
        console.error("Error al eliminar mural:", error);
        return [null, "Error interno del servidor"];
    }
}