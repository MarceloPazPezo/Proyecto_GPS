import axios from './root.service.js';
import { formatCarreraData } from '@helpers/formatData.js';

export async function createCarrera(carreraData) {
    try {
        const response = await axios.post('/carrera/', carreraData);
        console.log("Carrera creada:", response.data);
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
}

export async function getCarreras() {
    try {
        const { data } = await axios.get('/carrera/');
        const formattedData = data.data.map(formatCarreraData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateCarrera(data, codigo) {
    try {
        const response = await axios.patch(`/carrera/detail/?codigo=${codigo}`, data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteCarrera(codigo) {
    try {
        const response = await axios.delete(`/carrera/detail/?codigo=${codigo}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function importCarreras(carreras) {
    try {
        const response = await axios.post('/carrera/import', { carreras });
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
}

export async function getMisCarreras() {
    try {
        const { data } = await axios.get('/carrera/encargado/');
        // Si la respuesta tiene un array en data.data, lo formateamos
        const formattedData = Array.isArray(data.data)
            ? data.data.map(formatCarreraData)
            : [];
        return { data: formattedData };
    } catch (error) {
        return { data: [] };
    }
}