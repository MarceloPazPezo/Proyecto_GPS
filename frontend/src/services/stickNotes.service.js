import axios from "./root.service.js";


export async function crearNota(data) {
    try {
        const response = await axios.post('/notas/crearNota', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear nota:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function crearMural(data) {
    try {
        const response = await axios.post('/mural/crearMural', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear el mural:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function getNote(idNote) {
    try {
        const response = await axios.get(`/notas/nota/${idNote}`);
        return response.data.data
    } catch (error) {
        console.error("Error al obtener una nota:",error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function getNotesByMural(idMural) {
    try {
        const response = await axios.get(`/notas/mural/${idMural}`);
        return response.data.data
    } catch (error) {
        console.error("Error al obtener las nota del mural:",error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function getMural(idMural) {
    try {
        const response = await axios.get(`/mural/${idMural}`);
        return response.data.data
    } catch (error) {
        console.error("Error al obtener un mural:",error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function getMuralByUsuario(idUser) {
    try {
        const response = await axios.get(`/mural/muralUsuario/${idUser}`);
        return response.data.data
    } catch (error) {
        console.error("Error al obtener un mural:",error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function updateNote(idNote, data) {
    try {
        const response = await axios.put(`/notas/${idNote}`, data);
        return response.data.data
    } catch (error) {
        console.error("Error al actualizar la nota:",error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function updateMural(idMural, data) {
    try {
        const response = await axios.put(`/mural/${idMural}`, data);
        return response.data.data
    } catch (error) {
        console.error("Error al actualizar el mural:",error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function deleteNote(idNote) {
    try {
        const response = await axios.delete(`/notas/${idNote}`);
        return response.data.data;
    } catch (error) {
        console.error("Error al eliminar la nota:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function deleteMural(idMural) {
    try {
        const response = await axios.delete(`/mural/${idMural}`);
        return response.data.data;
    } catch (error) {
        console.error("Error al eliminar el mural:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}

export async function saveMuralFront(idMural, notes) {
    try {
        const response = await axios.put(`/mural/save/${idMural}`, { notes });
        return response.data;
    } catch (error) {
        console.error("Error al guardar el mural:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error de red o del servidor");
    }
}