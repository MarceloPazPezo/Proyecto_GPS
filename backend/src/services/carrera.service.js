"use strict";
import Carrera from "../entity/carrera.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createCarreraService(body) {
  try {
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const errors = [];
    if (body.nombre) {
      const existingNombre = await carreraRepository.findOne({ where: { nombre: body.nombre } });
      if (existingNombre) {
        errors.push({ field: 'nombre', message: 'El nombre de la carrera ya está registrado' });
      }
    }
    if (errors.length > 0) {
      return [null, { status: 'Client error', message: 'Error creando la carrera', details: errors }];
    }

    const newCarrera = carreraRepository.create({
      nombre: body.nombre,
      codigo: body.codigo.toUpperCase(),
      descripcion: body.descripcion || null,
      departamento: body.departamento,
      idEncargado: body.idEncargado,
    });
    const savedCarrera = await carreraRepository.save(newCarrera);

    const carreraFound = await carreraRepository.findOne({
      where: { id: savedCarrera.id },
      relations: ["idEncargado"],
    });
    if (!carreraFound) return [null, "Carrera no encontrada"];
    // Unificar formato como en getCarrerasService
    const result = {
      id: carreraFound.id,
      nombre: carreraFound.nombre,
      codigo: carreraFound.codigo,
      descripcion: carreraFound.descripcion,
      departamento: carreraFound.departamento,
      createdAt: carreraFound.createdAt,
      idEncargado: carreraFound.idEncargado?.id || null,
      rutEncargado: carreraFound.idEncargado?.rut || null,
    };
    return [result, null];
  } catch (error) {
    console.error("Error al crear una carrera:", error);
    return [null, { status: 'Server error', message: 'Error interno del servidor al crear la carrera.' }];
  }
}

export async function getCarreraService(query) {
  try {
    const { id, nombre } = query;
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const carreraFound = await carreraRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
      relations: ["idEncargado"],
    });
    if (!carreraFound) return [null, "Carrera no encontrada"];
    // Unificar formato como en getCarrerasService
    const result = {
      id: carreraFound.id,
      nombre: carreraFound.nombre,
      codigo: carreraFound.codigo,
      descripcion: carreraFound.descripcion,
      departamento: carreraFound.departamento,
      createdAt: carreraFound.createdAt,
      idEncargado: carreraFound.idEncargado?.id || null,
      rutEncargado: carreraFound.idEncargado?.rut || null,
    };
    return [result, null];
  } catch (error) {
    console.error("Error obtener la carrera:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getCarrerasService() {
  try {
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const carreras = await carreraRepository.find({ relations: ["idEncargado"] });
    if (!carreras || carreras.length === 0) return [[], "No hay carreras"];
    const carrerasMin = carreras.map(c => ({
      id: c.id,
      nombre: c.nombre,
      codigo: c.codigo,
      descripcion: c.descripcion,
      departamento: c.departamento,
      createdAt: c.createdAt,
      idEncargado: c.idEncargado?.id || null,
      rutEncargado: c.idEncargado?.rut || null,
    }));
    return [carrerasMin, null];
  } catch (error) {
    console.error("Error al obtener las carreras:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateCarreraService(query, body) {
  try {
    const { id, nombre, codigo } = query;
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const carreraFound = await carreraRepository.findOne({ where: [{ id: id }, { nombre: nombre }, { codigo: codigo }] });
    if (!carreraFound) return [null, "Carrera no encontrada"];
    if (body.nombre) {
      const existingCarrera = await carreraRepository.findOne({ where: { nombre: body.nombre } });
      if (existingCarrera && existingCarrera.id !== carreraFound.id) {
        return [null, "Ya existe una carrera con el mismo nombre"];
      }
    }
    await carreraRepository.update({ id: carreraFound.id }, { nombre: body.nombre });
    const carreraData = await carreraRepository.findOne({ where: { id: carreraFound.id }, relations: ["idEncargado"] });
    if (!carreraData) {
      return [null, "Carrera no encontrada después de actualizar"];
    }
    // Unificar formato como en getCarrerasService
    const result = {
      id: carreraData.id,
      nombre: carreraData.nombre,
      codigo: carreraData.codigo,
      descripcion: carreraData.descripcion,
      departamento: carreraData.departamento,
      createdAt: carreraData.createdAt,
      idEncargado: carreraData.idEncargado?.id || null,
      rutEncargado: carreraData.idEncargado?.rut || null,
    };
    return [result, null];
  } catch (error) {
    console.error("Error al modificar una carrera:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteCarreraService(query) {
  try {
    const { id, codigo } = query;
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const carreraFound = await carreraRepository.findOne({ where: [{ id: id }, { codigo: codigo }] });
    if (!carreraFound) return [null, "Carrera no encontrada"];
    const carreraDeleted = await carreraRepository.remove(carreraFound);
    return [carreraDeleted, null];
  } catch (error) {
    console.error("Error al eliminar una carrera:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function importCarrerasService(carrerasArray) {
  try {
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const validCarreras = [];
    const invalidCarreras = [];
    const seenNombres = {};
    for (let i = 0; i < carrerasArray.length; i++) {
      const carrera = carrerasArray[i];
      const fieldErrors = [];
      if (carrera.nombre && seenNombres[carrera.nombre] !== undefined) {
        fieldErrors.push({ field: 'nombre', message: `Nombre duplicado en archivo (fila ${seenNombres[carrera.nombre] + 1})` });
      } else {
        seenNombres[carrera.nombre] = i;
      }
      const existingNombre = await carreraRepository.findOne({ where: { nombre: carrera.nombre } });
      if (existingNombre) {
        fieldErrors.push({ field: 'nombre', message: 'Nombre duplicado en base de datos' });
      }
      if (fieldErrors.length > 0) {
        invalidCarreras.push({ index: i, carrera, error: fieldErrors });
        continue;
      }
      validCarreras.push(carrera);
    }
    const createdCarreras = [];
    if (validCarreras.length > 0) {
      for (const carrera of validCarreras) {
        const newCarrera = carreraRepository.create({ nombre: carrera.nombre });
        const savedCarrera = await carreraRepository.save(newCarrera);
        createdCarreras.push(savedCarrera);
      }
    }
    if (createdCarreras.length === 0) {
      return [null, { invalidCarreras }];
    }
    return [createdCarreras, { invalidCarreras }];
  } catch (error) {
    console.error("Error al importar carreras:", error);
    return [null, "Error interno del servidor al importar carreras."];
  }
}
