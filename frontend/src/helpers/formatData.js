import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

// Función personalizada para capitalizar que preserva caracteres especiales del español
function capitalizeSpanish(str) {
    if (!str) return str;
    return str.split(' ').map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

export function formatUserData(user) {
    return {
        ...user,
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        carreraCodigo: user.carreraCodigo || 'Sin Carrera',
        carreraNombre: user.carreraNombre || 'Sin Código',
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
        carreraCodigo: user.carreraCodigo || 'Sin Carrera',
        carreraNombre: user.carreraNombre || 'Sin Código',
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

export function formatCarreraData(carrera) {
    return {
        ...carrera,
        nombre: capitalizeSpanish(carrera.nombre),
        codigo: carrera.codigo.toUpperCase(),
        descripcion: carrera.descripcion == undefined || carrera.descripcion == '' ? 'N/A' : carrera.descripcion,
        departamento: capitalizeSpanish(carrera.departamento),
        rutEncargado: formatRut(carrera.rutEncargado),
    };
}

export function formatPostUpdateCarreraData(carrera) {
    return {
        ...carrera,
        nombre: capitalizeSpanish(carrera.nombre),
        codigo: carrera.codigo.toUpperCase(),
        descripcion: carrera.descripcion,
        departamento: capitalizeSpanish(carrera.departamento),
        rutEncargado: formatRut(carrera.rutEncargado),
        createdAt: formatTempo(carrera.createdAt, "DD-MM-YYYY")
    };
}