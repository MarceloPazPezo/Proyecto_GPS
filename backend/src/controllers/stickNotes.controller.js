"use strict";
import {
    createStickyNoteService,
    deleteStickyNoteService,
    getStickNoteService,
    getStickNotesService,
    saveMuralService,
    updateStickNoteService,
} from "../services/stickyNotes.service.js";

import {
    createMuralService,
    deleteMuralService,
    getMuralesByUserService,
    getMuralService,
    updateMuralService,
} from "../services/mural.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createMural(req, res) {
    try {
        const { titulo } = req.body;

        if (!titulo || titulo.trim().length < 3) {
            return handleErrorClient(res, 400, "Debe ingresar un titulo mayor a 3");
        }
        const [newMural, errorMural] = await createMuralService(req.body);
        if (errorMural)
            return handleErrorClient(res, 400, "Error al crear el mural", errorMural);
        return handleSuccess(res, 201, "Se ha creado el mural", newMural);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createNote(req, res) {
    try {
        const { idMural, titulo, descripcion, color, posx, posy } = req.body;
        const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

        if (!titulo || titulo.trim().length < 3)
            return handleErrorClient(res, 400, "El título debe tener al menos 3 caracteres");

        if (!color || !hexColorRegex.test(color))
            return handleErrorClient(res, 400, "El color debe ser un valor hexadecimal");

        if (typeof posx !== "number" || isNaN(posx))
            return handleErrorClient(res, 400, "La posición X debe ser un número válido");

        if (typeof posy !== "number" || isNaN(posy))
            return handleErrorClient(res, 400, "La posición Y debe ser un número válido");

        const [newNote, errorNote] = await createStickyNoteService(idMural, { titulo, descripcion, color, posx, posy });

        if (errorNote)
            return handleErrorClient(res, 400, "Error al crear la nota", errorNote);

        return handleSuccess(res, 201, "Nota creada exitosamente", newNote);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteMural(req, res) {
    try {
        const { id } = req.params;

        if (!id)
            return handleErrorClient(res, 400, "No se especificó el mural a eliminar");

        const [deletedMural, errorDelete] = await deleteMuralService({ id });

        if (errorDelete)
            return handleErrorClient(res, 400, errorDelete);

        return handleSuccess(res, 200, "Mural eliminado exitosamente", deletedMural);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteNote(req, res) {
    try {
        const { id } = req.params;

        if (!id)
            return handleErrorClient(res, 400, "No se especificó la nota a eliminar");

        const [deletedNote, errorDelete] = await deleteStickyNoteService({ id });

        if (errorDelete)
            return handleErrorClient(res, 400, errorDelete);

        return handleSuccess(res, 200, "Nota eliminada exitosamente", deletedNote);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getMural(req, res) {
    try {
        const { id } = req.params;

        if (!id)
            return handleErrorClient(res, 400, "No se especificó el mural a buscar");

        const [mural, errorMural] = await getMuralService(id);

        if (errorMural)
            return handleErrorClient(res, 404, errorMural);

        return handleSuccess(res, 200, "Mural encontrado", mural);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getStickNote(req, res) {
    try {
        const { idNote } = req.params;

        if (!idNote)
            return handleErrorClient(res, 400, "No se especificó la nota");

        const [note, errorNote] = await getStickNoteService(idNote);

        if (errorNote)
            return handleErrorClient(res, 404, errorNote);

        return handleSuccess(res, 200, "Nota encontrada", note);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getMuralesByUser(req, res) {
    try {
        const { idUser } = req.params;

        if (!idUser)
            return handleErrorClient(res, 400, "No se especificó el usuario");

        const [murales, errorMurales] = await getMuralesByUserService(idUser);

        if (errorMurales)
            return handleErrorClient(res, 500, errorMurales);

        return handleSuccess(res, 200, "Murales encontrados", murales);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getStickNotes(req, res) {
    try {
        const { idMural } = req.params;

        if (!idMural)
            return handleErrorClient(res, 400, "No se especificó el mural para buscar notas");

        const [notes, errorNotes] = await getStickNotesService(idMural);

        if (errorNotes)
            return handleErrorClient(res, 500, errorNotes);

        return handleSuccess(res, 200, "Notas encontradas", notes);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateMural(req, res) {
    try {
        const { id } = req.params;
        const { titulo } = req.body;

        if (!id)
            return handleErrorClient(res, 400, "No se especificó el mural a actualizar");

        if (titulo !== undefined && (typeof titulo !== "string" || titulo.trim().length < 3)) {
            return handleErrorClient(res, 400, "El título debe tener al menos 3 caracteres si se proporciona");
        }

        const [updatedMural, errorUpdate] = await updateMuralService({ id }, { titulo });

        if (errorUpdate)
            return handleErrorClient(res, 400, errorUpdate);

        return handleSuccess(res, 200, "Mural actualizado exitosamente", updatedMural);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateNote(req, res) {
    try {
        const { id } = req.params;
        const { titulo, descripcion, color, posx, posy } = req.body;
        const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

        if (titulo !== undefined && (typeof titulo !== "string" || titulo.trim().length < 3)) {
            return handleErrorClient(res, 400, "El título debe tener al menos 3 caracteres si se proporciona");
        }

        if (color !== undefined && !hexColorRegex.test(color)) {
            return handleErrorClient(res, 400, "El color debe ser un valor hexadecimal válido si se proporciona");
        }

        if (posx !== undefined && (typeof posx !== "number" || isNaN(posx))) {
            return handleErrorClient(res, 400, "La posición X debe ser un número válido si se proporciona");
        }

        if (posy !== undefined && (typeof posy !== "number" || isNaN(posy))) {
            return handleErrorClient(res, 400, "La posición Y debe ser un número válido si se proporciona");
        }

        const updateData = {};
        if (titulo !== undefined) updateData.titulo = titulo;
        if (descripcion !== undefined) updateData.descripcion = descripcion;
        if (color !== undefined) updateData.color = color;
        if (posx !== undefined) updateData.posx = posx;
        if (posy !== undefined) updateData.posy = posy;

        const [updatedNote, errorUpdate] = await updateStickNoteService({ id }, updateData);

        if (errorUpdate)
            return handleErrorClient(res, 400, errorUpdate);

        return handleSuccess(res, 200, "Nota actualizada exitosamente", updatedNote);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export const saveMuralNotas = async (req, res) => {
    const { idMural } = req.params;
    const { notes } = req.body;
    try {
        await saveMuralService(idMural, notes);
        return handleSuccess(res, 200, "Mural guardado correctamente");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};
