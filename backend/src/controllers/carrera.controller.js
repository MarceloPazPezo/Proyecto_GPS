"use strict";
import {
  getCarreraService,
  getCarrerasService,
  createCarreraService,
  updateCarreraService,
  deleteCarreraService,
  importCarrerasService,
} from "../services/carrera.service.js";
import {
  carreraCreateValidation,
  carreraQueryValidation,
  carreraBodyValidation,
} from "../validations/carrera.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createCarrera(req, res) {
  try {
    const { body } = req;
    const { error } = carreraCreateValidation.validate(body);
    if (error) {
      const details = error.details
        ? error.details.map((e) => ({
            field: e.path?.[0] || "unknown",
            message: e.message,
          }))
        : [{ field: "unknown", message: error.message }];
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        details,
      );
    }
    const [carrera, errorCarrera] = await createCarreraService(body);
    if (errorCarrera) {
      if (errorCarrera.details) {
        return handleErrorClient(
          res,
          400,
          errorCarrera.message || "Error creando la carrera",
          errorCarrera.details,
        );
      }
      return handleErrorClient(
        res,
        400,
        "Error creando la carrera",
        errorCarrera,
      );
    }
    handleSuccess(res, 201, "Carrera creada correctamente", carrera);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getCarrera(req, res) {
  try {
    const { id, nombre } = req.query;
    const { error } = carreraQueryValidation.validate({ id, nombre });
    if (error) return handleErrorClient(res, 400, error.message);
    const [carrera, errorCarrera] = await getCarreraService({ id, nombre });
    if (errorCarrera) return handleErrorClient(res, 404, errorCarrera);
    handleSuccess(res, 200, "Carrera encontrada", carrera);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getCarreras(req, res) {
  try {
    const [carreras, errorCarreras] = await getCarrerasService();
    if (errorCarreras) return handleErrorClient(res, 404, errorCarreras);
    carreras.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Carreras encontradas", carreras);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateCarrera(req, res) {
  try {
    const { id, nombre } = req.query;
    const { body } = req;
    const { error: queryError } = carreraQueryValidation.validate({
      id,
      nombre,
    });
    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }
    const { error: bodyError } = carreraBodyValidation.validate(body);
    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );
    const [carrera, carreraError] = await updateCarreraService(
      { id, nombre },
      body,
    );
    if (carreraError)
      return handleErrorClient(
        res,
        400,
        "Error modificando la carrera",
        carreraError,
      );
    handleSuccess(res, 200, "Carrera modificada correctamente", carrera);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteCarrera(req, res) {
  try {
    const { id, nombre } = req.query;
    const { error: queryError } = carreraQueryValidation.validate({
      id,
      nombre,
    });
    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }
    const [carreraDelete, errorCarreraDelete] = await deleteCarreraService({
      id,
      nombre,
    });
    if (errorCarreraDelete)
      return handleErrorClient(
        res,
        404,
        "Error eliminando la carrera",
        errorCarreraDelete,
      );
    handleSuccess(res, 200, "Carrera eliminada correctamente", carreraDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function importCarreras(req, res) {
  try {
    const { carreras } = req.body;
    if (!Array.isArray(carreras) || carreras.length === 0) {
      return handleErrorClient(res, 400, "Debes enviar un array de carreras");
    }
    const validCarreras = [];
    const invalidCarreras = [];
    for (let i = 0; i < carreras.length; i++) {
      const carrera = carreras[i];
      const { value, error } = carreraCreateValidation.validate(carrera, {
        abortEarly: false,
      });
      if (error) {
        const fieldErrors = error.details?.map((e) => ({
          field: e.path && e.path.length > 0 ? e.path[0] : "unknown",
          message: e.message,
        })) || [{ field: "unknown", message: error.message }];
        invalidCarreras.push({ index: i, carrera, error: fieldErrors });
        continue;
      }
      validCarreras.push({ ...value, __originalIndex: i });
    }
    if (validCarreras.length === 0) {
      return handleErrorClient(
        res,
        400,
        "Ninguna carrera es válida para importar",
        { invalidCarreras },
      );
    }
    const [importedCarreras, error] =
      await importCarrerasService(validCarreras);
    if (!importedCarreras || importedCarreras.length === 0) {
      return handleErrorClient(
        res,
        400,
        error?.invalidCarreras
          ? "Ninguna carrera fue importada"
          : error || "Ninguna carrera fue importada",
        error?.invalidCarreras
          ? { invalidCarreras: error.invalidCarreras }
          : undefined,
      );
    }
    const importedWithIndex = (importedCarreras || []).map((c) => {
      const match = validCarreras.find((v) => v.nombre === c.nombre);
      return { ...c, index: match ? match.__originalIndex : null };
    });
    return handleSuccess(res, 201, "Carreras importadas correctamente", {
      imported: importedWithIndex,
      invalidCarreras,
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMyCarreras(req, res) {
  try {
    const userAuth = req.user; // Asumiendo que el usuario autenticado está en req.user
    if (!userAuth?.carrerasEncargado || userAuth.carrerasEncargado.length === 0)
      return handleErrorClient(res, 404, "No tienes carreras asignadas");

    const [carreras, errorCarreras] = await getCarrerasService(
      userAuth.carrerasEncargado,
    );
    if (errorCarreras) return handleErrorClient(res, 404, errorCarreras);
    carreras.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Carreras encontradas", carreras);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
