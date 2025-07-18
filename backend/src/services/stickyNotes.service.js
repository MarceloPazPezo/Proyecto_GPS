"use strict";
import StickyNotes from "../entity/stickyNotes.entity.js";
import Mural from "../entity/mural.entity.js";
import { AppDataSource } from "../config/configDb.js";

const StickyNoteRepository = AppDataSource.getRepository(StickyNotes);
const MuralRepository = AppDataSource.getRepository(Mural);

export async function getStickNoteService(idNote) {
    try{
        const respuestaNote = await StickyNoteRepository.findOne({
            where: [{ id: idNote }]
        });

        if(!respuestaNote) return [null,"Nota no encontrada"];

        return [respuestaNote,null]

    }catch (error){
        console.error("Error al obtener la respuesta:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getStickNotesService(idMural) {
    try {
        const notes = await StickyNoteRepository.find({
            where: { mural: { id: idMural } },
            relations: ["mural"] 
        });

        if (!notes || notes.length === 0) return [[], "No se encontraron notas para este mural"];

        return [notes, null];

    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null,"Error interno del servidor"];
    }
}

export async function deleteStickyNoteService(body) {
    try {

        const result = await StickyNoteRepository.delete(body);

        if (result.affected === 0)
            return [null, "La nota no existe"];

        return [result, null];

    } catch (error) {
        console.error("Error al eliminar la nota:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateStickNoteService(query,body) {
    try{
        const { id } = query;
        const notaFound = await StickyNoteRepository.findOne({
            where: [{ id: id }]
        });

        if (!notaFound) return [null, "No existe la nota"];

        const notaUpdate = {
            titulo: body.titulo,
            descripcion: body.descripcion,
            color: body.color,
            posx: body.posx,
            posy: body.posy,
        }

        await StickyNoteRepository.update({ id: notaFound.id }, notaUpdate);

        const updatedNote = await StickyNoteRepository.findOne({
            where: [{ id: id }]
        });

        if (!updatedNote) return [null, "No se encontra la nota tras actualizar"];

        return [updatedNote,null];

    }catch(error){
        console.error("Error al modificar", error);
        return [null, "Error interno del servidor"];

    }
}

export async function createStickyNoteService(idMural, body) {
    try {
        const muralFound = await MuralRepository.findOne({
            where: { id: idMural }
        });

        if (!muralFound) return [null, "El mural no existe"];

        const newNote = StickyNoteRepository.create({
            titulo: body.titulo,
            descripcion: body.descripcion,
            color: body.color,
            posx: body.posx,
            posy: body.posy,
            mural: muralFound
        });

        const savedNote = await StickyNoteRepository.save(newNote);

        return [savedNote, null];

    } catch (error) {
        console.error("Error al crear la nota:", error);
        return [null, "Error interno del servidor"];
    }
}