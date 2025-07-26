import Cuestionario from "../entity/cuestionario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Respuesta from "../entity/respuesta.entity.js";
import Pregunta from "../entity/preguntas.entity.js";
import { deleteFile } from './minio.service.js';

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
        const quizFound = await cuestRepository.find({ where: { idUser: idUser } })
        if (!quizFound) return [null, "No se encontraron cuestionarios"];
        return [quizFound, null];
    } catch (error) {
        console.error("Error al buscar", error);
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

export async function updateCuestionarioService(idCuestionario, body) {
    try {

        const cuestFound = await cuestRepository.findOne({
            where: [{ id: idCuestionario }]
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
            where: {
                idUser: idUser,
                id: id,
                nombre: nombre,
            },
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

export async function addLotepPreguntasService({ preguntas }) {
    
    const preguntaRepository = AppDataSource.getRepository(Pregunta);
    const respuestaRepository = AppDataSource.getRepository(Respuesta);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 1. Insertar todas las preguntas (incluyendo imagenUrl e imagenKey si existen)
        const preguntasToSave = preguntas.map(({ texto, idCuestionario, imagenUrl, imagenKey }) => ({
            texto,
            idCuestionario,
            imagenUrl: imagenUrl || null,
            imagenKey: imagenKey || null
        }));
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
                'p.texto AS texto',
                'p."imagenUrl" AS "imagenUrl"'
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

        console.log("Preguntas y respuestas obtenidas:", result);
        return [result, null]
    }
    catch (error) {
        console.error("Error al obtener preguntas y respuestas:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function elimnarALLpreguntas(idCuestionario) {
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const respuestaRepository = AppDataSource.getRepository(Respuesta);

        // Eliminar respuestas asociadas a las preguntas del cuestionario
        await respuestaRepository.delete({ idPreguntas: idCuestionario });

        // Eliminar preguntas del cuestionario
        await preguntaRepository.delete({ idCuestionario: idCuestionario });

        return [true, null];
    } catch (error) {
        console.error("Error al eliminar preguntas y respuestas:", error);
        return [null, "Error interno del servidor"];
    }
}



export async function actualizarCuestionarioCompletoService(idCuestionario, data) {
    const { cuestionarioData, preguntasData } = data;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // --- PASO 1: ACTUALIZAR EL CUESTIONARIO ---
        const cuestRepository = queryRunner.manager.getRepository(Cuestionario);
        const cuestFound = await cuestRepository.findOneBy({ id: idCuestionario });

        if (!cuestFound) {
            throw new Error(`El cuestionario con ID ${idCuestionario} no existe.`);
        }

        // Actualizamos los datos del cuestionario (título, etc.)
        cuestRepository.merge(cuestFound, {
            idUser: cuestionarioData.idUser,
            nombre: cuestionarioData.nombre,
        });
        const updatedCuestionario = await queryRunner.manager.save(Cuestionario, cuestFound);

        // --- PASO 2: OBTENER LAS PREGUNTAS ANTIGUAS PARA ELIMINAR IMÁGENES ---
        const preguntaRepository = queryRunner.manager.getRepository(Pregunta);
        const preguntasAntiguas = await preguntaRepository.find({ 
            where: { idCuestionario: idCuestionario },
            select: ["id", "imagenKey"] // Solo necesitamos el ID y la clave de la imagen
        });

        // Recopilamos las claves de imágenes para eliminar después
        const imagenesParaEliminar = preguntasAntiguas
            .filter(p => p.imagenKey) // Solo las preguntas con imágenes
            .map(p => p.imagenKey);

        // --- PASO 3: ELIMINAR TODAS LAS PREGUNTAS ANTIGUAS ---
        // Esto eliminará todas las preguntas asociadas al cuestionario.
        // Si tienes "ON DELETE CASCADE" en la relación Pregunta->Respuesta, las respuestas se borrarán automáticamente.
        await preguntaRepository.delete({ idCuestionario: idCuestionario });

        // --- PASO 4: INSERTAR LAS NUEVAS PREGUNTAS Y RESPUESTAS ---
        if (preguntasData && preguntasData.length > 0) {
            // a) Creamos las nuevas preguntas con sus imágenes si existen
            const preguntasNuevas = preguntasData.map(p => {
                return preguntaRepository.create({
                    texto: p.texto,
                    idCuestionario: updatedCuestionario.id,
                    imagenUrl: p.imagenUrl || null,
                    imagenKey: p.imagenKey || null
                });
            });
            const preguntasGuardadas = await queryRunner.manager.save(Pregunta, preguntasNuevas);

            // b) Preparamos todas las respuestas para una inserción masiva (bulk insert)
            const respuestasRepository = queryRunner.manager.getRepository(Respuesta);
            let respuestasToSave = [];

            preguntasGuardadas.forEach((preguntaGuardada, index) => {
                const respuestasDeLaPreguntaOriginal = preguntasData[index].Respuestas || [];
                
                const nuevasRespuestas = respuestasDeLaPreguntaOriginal.map(r => {
                    return respuestasRepository.create({
                        textoRespuesta: r.textoRespuesta,
                        correcta: r.correcta,
                        idPreguntas: preguntaGuardada.id, // Asociamos con el ID de la NUEVA pregunta
                    });
                });
                respuestasToSave.push(...nuevasRespuestas);
            });

            // c) Guardamos todas las nuevas respuestas en una sola operación
            if (respuestasToSave.length > 0) {
                await queryRunner.manager.save(Respuesta, respuestasToSave);
            }
        }
        
        // Si todos los pasos fueron exitosos, confirmamos la transacción.
        await queryRunner.commitTransaction();

        // --- PASO 5: ELIMINAR LAS IMÁGENES ANTIGUAS DE MINIO ---
        // Esto se hace fuera de la transacción para no bloquear la BD
        // y porque no es crítico para la integridad de los datos
        for (const imagenKey of imagenesParaEliminar) {
            await deleteFile(imagenKey).catch(err => {
                console.error(`Error al eliminar imagen ${imagenKey} de MinIO:`, err);
                // No lanzamos el error para no afectar la respuesta al cliente
            });
        }

        // Para devolver una respuesta completa, volvemos a buscar el cuestionario con sus nuevas relaciones.
        const resultadoFinal = await AppDataSource.getRepository(Cuestionario).findOne({
            where: { id: idCuestionario },
            relations: {
                preguntas: {
                    respuestas: true, // Carga anidada de preguntas y sus respuestas
                },
            },
        });

        return [resultadoFinal, null];

    } catch (error) {
        // Si cualquier paso falla, revertimos todos los cambios en la base de datos.
        console.error("Error en transacción, iniciando rollback:", error);
        await queryRunner.rollbackTransaction();
        return [null, error.message || "Error interno del servidor al actualizar el cuestionario."];

    } finally {
        // Es crucial liberar el queryRunner para devolver la conexión al pool.
        await queryRunner.release();
    }
}

