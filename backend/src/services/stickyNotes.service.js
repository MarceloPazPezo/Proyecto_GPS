"use strict";

import StickyNotes from "../entity/stickyNotes.entity.js";
import Mural from "../entity/mural.entity.js";
import { AppDataSource } from "../config/configDb.js";

const StickyNoteRepository = AppDataSource.getRepository(StickyNotes);
const MuralRepository = AppDataSource.getRepository(Mural);

export async function getStickNoteService(idNote) {
    try {
        const respuestaNote = await StickyNoteRepository.findOne({
            where: { id: idNote }
        });

        if (!respuestaNote) return [null, "Nota no encontrada"];

        return [respuestaNote, null];
    } catch (error) {
        console.error("Error al obtener la nota:", error);
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
        return [null, "Error interno del servidor"];
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

export async function updateStickNoteService(query, body) {
    try {
        const id = query.id; // UUID directamente

        const notaFound = await StickyNoteRepository.findOne({
            where: { id: id }
        });

        if (!notaFound) return [null, "No existe la nota"];

        const notaUpdate = {
            titulo: body.titulo,
            descripcion: body.descripcion,
            color: body.color,
            posx: body.posx,
            posy: body.posy
        };

        await StickyNoteRepository.update({ id: notaFound.id }, notaUpdate);

        const updatedNote = await StickyNoteRepository.findOne({
            where: { id: id }
        });

        if (!updatedNote) return [null, "No se encontró la nota tras actualizar"];

        return [updatedNote, null];
    } catch (error) {
        console.error("Error al modificar la nota:", error);
        return [null, "Error interno del servidor"];

    }
}

export async function createStickyNoteService(idMural, body) {
    try {
        const { titulo, descripcion, color, posx, posy } = body;

        const muralFound = await MuralRepository.findOne({
            where: { id: idMural }
        });

        if (!muralFound) return [null, "El mural no existe"];

        const newNote = StickyNoteRepository.create({
            titulo,
            descripcion,
            color,
            posx,
            posy,
            mural: muralFound
        });

        const savedNote = await StickyNoteRepository.save(newNote);

        return [savedNote, null];
        
    } catch (error) {
        console.error("Error al crear la nota:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function saveMuralService(idMural, notes) {
    try {
        const resultados = [];

        for (const nota of notes) {
            let resultado;
            const esIdTemporal = typeof nota.id === "string" && nota.id.startsWith("temp-");

            if (esIdTemporal) {
                resultado = await createStickyNoteService(idMural, nota);
            } else {
                resultado = await updateStickNoteService({ id: nota.id }, nota);
            }

            resultados.push(resultado);
        }

        return [resultados, null];
    } catch (error) {
        console.error("Error al guardar o actualizar las notas:", error);
        return [null, "Error interno del servidor"];
    }
}
