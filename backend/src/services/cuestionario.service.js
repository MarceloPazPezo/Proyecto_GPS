import Cuestionario from "../entity/cuestionario.entity.js";
import { AppDataSource } from "../config/configDb.js";

const cuestRepository = AppDataSource.getRepository(Cuestionario);

export async function createCuestionarioService(data) {
    try {
        const { idUser, nombre } = data;
        const existing = await cuestRepository.findOne({
            where: { idUser: idUser, nombre: nombre }
        });
        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });
        if (existing) {
            return [null, createErrorMessage("nombre", "Ya existe un cuestionario con ese nombre para este usuario")];
        }

        const newCuest = cuestRepository.create({
            idUser: idUser,
            nombre: nombre
        });

        await cuestRepository.save(newCuest);

        return [newCuest, null];

    } catch (error) {
        console.error("Error al crear", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCuestionariosService() {
    try {
        const cuestFound = await cuestRepository.find();
        if (!cuestFound) {
            return [null, "No se encontraron cuestionarios"];
        }
        return [cuestFound, null];
    } catch (error) {
        console.error("Error al buscar", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCuestionariosByUserService(idUser) {
    try {
        const quizFound=await cuestRepository.find({where:{idUser:idUser}})
        if(!quizFound) return [null, "No se encontraron cuestionarios"];
        return [quizFound, null];
    } catch (error) {
        console.error("Error al buscar",error);
        return [null, "Error interno del servidor"];
    }
}

export async function getCuestionarioService(data) {
    try {
        const { idUser, nombre, id } = data
        const cuestFound = await cuestRepository.findOne({
            where: [{ idUser: idUser }, { nombre: nombre }, { id: id }]
        });

        if (!cuestFound) return [null, "No se encontro el cuestionario"];

        return [cuestFound, null];
    } catch (error) {
        console.error("Error al buscar", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateCuestionarioService(query, body) {
    try {
        const { idUser, nombre, id } = query;
        const cuestFound = await cuestRepository.findOne({
            where: [{ idUser }, { id: id }, { nombre: nombre }]
        });
        if (!cuestFound) return [null, "El cuestionario no existe"];

        const cuestUpdate = {
            idUser: body.idUser,
            nombre: body.nombre
        }

        await cuestRepository.update({ id: cuestFound.id }, cuestUpdate);

        const updatedCuest = await cuestRepository.findOne({ where: [{ id: cuestFound.id }] });

        if (!updatedCuest) return [null, "No se encontro tras actualizacion"];

        return [updatedCuest, null];
    } catch (error) {
        console.error("Error al modificar", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteCuestionarioService(data) {
    try {
        const { idUser, id, nombre } = data;
        const cuestFound = await cuestRepository.findOne({
            where: [{ idUser: idUser }, { id: id }, { nombre: nombre }]
        });

        if (!cuestFound) return [null, "El cuestionario no existe"];

        const deletedCuest = await cuestRepository.delete(cuestFound.id);

        return [deletedCuest, null];
    } catch (error) {
        console.error("Error al eliminar", error);
        return [null, "Error interno del servidor"];
    }
}

//Jerson 

import Respuesta from "../entity/respuesta.entity.js";
import Pregunta from "../entity/preguntas.entity.js";

export async function addLotepPreguntasService({ preguntas }) {
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const respuestaRepository = AppDataSource.getRepository(Respuesta);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 1. Insertar todas las preguntas
        const preguntasToSave = preguntas.map(({ texto, idCuestionario }) => ({ texto, idCuestionario }));
        const preguntasGuardadas = await queryRunner.manager.save(Pregunta, preguntasToSave);

        // 2. Insertar todas las respuestas asociadas a cada pregunta
        let respuestasToSave = [];
        preguntasGuardadas.forEach((preguntaGuardada, idx) => {
            const respuestas = preguntas[idx].Respuestas.map(r => ({
                ...r,
                idPreguntas: preguntaGuardada.id // Asocia la respuesta a la pregunta insertada
            }));
            respuestasToSave = respuestasToSave.concat(respuestas);
        });

        const respuestasGuardadas = await queryRunner.manager.save(Respuesta, respuestasToSave);

        await queryRunner.commitTransaction();

        // Puedes devolver las preguntas con sus respuestas asociadas si lo deseas
        return [{ preguntas: preguntasGuardadas, respuestas: respuestasGuardadas }, null];
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error al agregar lote de preguntas y respuestas:", error);
        return [null, "Error interno del servidor"];
    } finally {
        await queryRunner.release();
    }
}






export async function obtenerPreguntasYRespuestas(idCuestionario) {
    try {
        const result = await AppDataSource
            .getRepository('pregunta')
            .createQueryBuilder('p')
            .select([
                'p.id AS id',
                'p."idCuestionario" AS "idCuestionario"',
                'p.texto AS texto'
            ])
            .addSelect(`
      json_agg(
        json_build_object(
          'textoRespuesta', r."textoRespuesta",
          'correcta', r.correcta,
          'id', r.id,
          'idPreguntas', r."idPreguntas"
        )
      )`, 'Respuestas')
            .innerJoin('respuesta', 'r', 'r."idPreguntas" = p.id')
            .where('p."idCuestionario" = :idCuestionario', { idCuestionario })
            .groupBy('p.id')
            .getRawMany();

        
         return [result, null]
    }
    catch (error) {
        console.error("Error al obtener preguntas y respuestas:", error);
       return [null, "Error interno del servidor"];
    }
}

export async function ModLotepPreguntasService({ preguntas, idCuestionario }) {
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const respuestaRepository = AppDataSource.getRepository(Respuesta);

        // 1. Actualizar las preguntas
        for (const pregunta of preguntas) {
            const { id, texto } = pregunta;
            if (id && texto !== undefined) {
                await preguntaRepository.update(id, { texto });
            }
        }

        // 2. Actualizar las respuestas de cada pregunta
        for (const pregunta of preguntas) {
            if (Array.isArray(pregunta.Respuestas)) {
                for (const respuesta of pregunta.Respuestas) {
                    const { id, idPreguntas, textoRespuesta, correcta } = respuesta;
                    if (
                        id &&
                        idPreguntas !== undefined &&
                        textoRespuesta !== undefined &&
                        correcta !== undefined
                    ) {
                        await respuestaRepository.update(
                            { id, idPreguntas },
                            { textoRespuesta, correcta }
                        );
                    }
                }
            }
        }

        // Opcional: puedes devolver las preguntas actualizadas consultando de nuevo la BD si lo necesitas
        return [preguntas, null];

    } catch (error) {
        console.error("Error al modificar lote de preguntas y respuestas:", error);
        return [null, "Error interno del servidor"];
    }
}

