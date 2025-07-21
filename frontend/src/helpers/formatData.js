import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatUserData(user) {
    return {
        ...user,
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

export function convertirMinusculas(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
    return obj;
}

export function formatPostUpdate(user) {
    return {
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        email: user.email,
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

export function formatCarreraData(carrera) {
    return {
        ...carrera,
        nombre: startCase(carrera.nombre),
        codigo: carrera.codigo.toUpperCase(),
        descripcion: carrera.descripcion == undefined || carrera.descripcion == '' ? 'N/A' : startCase(carrera.descripcion),
        departamento: startCase(carrera.departamento),
        rutEncargado: formatRut(carrera.rutEncargado),
    };
}

export function formatPostUpdateCarreraData(carrera) {
    return {
        ...carrera,
        nombre: startCase(carrera.nombre),
        codigo: carrera.codigo.toUpperCase(),
        descripcion: startCase(carrera.descripcion),
        departamento: startCase(carrera.departamento),
        rutEncargado: formatRut(carrera.rutEncargado),
        createdAt: formatTempo(carrera.createdAt, "DD-MM-YYYY")
    };
}