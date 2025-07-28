import axios from './root.service.js';
import { formatUserData } from '@helpers/formatData.js';

export async function createUser(userData) {
    try {
        const response = await axios.post('/user/', userData);
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
}

export async function getUser(data){
    try {
        const response= await axios.post(`/EX/join`,{rut:data});
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getUsers() {
    try {
        const { data } = await axios.get('/user/');
        const formattedData = data.data.map(formatUserData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateUser(data, rut) {
    try {
        const response = await axios.patch(`/user/detail/?rut=${rut}`, data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteUser(rut) {
    try {
        const response = await axios.delete(`/user/detail/?rut=${rut}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getEncargadosCarrera() {
    try {
        const { data } = await axios.get('/user/?rol=encargado_carrera');
        const usuarios = data.data ? data.data : data;
        return usuarios.map(formatUserData);
    } catch (error) {
        console.error('Error obteniendo encargados de carrera:', error);
        return error.response.data;
    }
}

export async function getMisUsuarios() {
    try {
        const { data } = await axios.get('/user/mis-usuarios');
        const formattedData = Array.isArray(data.data)
            ? data.data.map(formatUserData)
            : [];
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

export async function createMiUsuario(userData) {
    try {
        const response = await axios.post('/user/mis-usuarios', userData);
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
}

export async function getMiUsuario(id) {
    try {
        const { data } = await axios.get(`/user/mis-usuarios/detail/?id=${id}`);
        return data.data ? formatUserData(data.data) : null;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateMiUsuario(id, userData) {
    try {
        const response = await axios.patch(`/user/mis-usuarios/detail/?id=${id}`, userData);
        return response.data.data;
    } catch (error) {
        return error.response?.data || error;
    }
}

export async function deleteMiUsuario(rut) {
    try {
        const response = await axios.delete(`/user/mis-usuarios/detail/?rut=${rut}`);
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
}

export async function importMisUsuarios(usuarios) {
    try {
        const response = await axios.post('/user/mis-usuarios/import', { usuarios });
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
}

export async function importUsers(users) {
    try {
        const response = await axios.post('/user/import', { users });
        return response.data;
    } catch (error) {
        return error.response?.data || error;
    }
}