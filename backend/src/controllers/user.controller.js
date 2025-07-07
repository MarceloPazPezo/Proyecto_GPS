"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
  importUsersService,
  createUserService,
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
  userCreateValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createUser(req, res) {
  try {
    const { body } = req;
    const { error } = userCreateValidation.validate(body);
    if (error) {
      // Unificar formato de error para el frontend
      const details = error.details
        ? error.details.map(e => ({ field: e.path?.[0] || 'unknown', message: e.message }))
        : [{ field: 'unknown', message: error.message }];
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        details,
      );
    }
    const [user, errorUser] = await createUserService(body);
    if (errorUser) {
      // Si el error viene con details, usar ese formato
      if (errorUser.details) {
        return handleErrorClient(res, 400, errorUser.message || "Error creando al usuario", errorUser.details);
      }
      // Si es string o cualquier otro formato
      return handleErrorClient(res, 400, "Error creando al usuario", errorUser);
    }
    handleSuccess(res, 201, "Usuario creado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error } = userQueryValidation.validate({ rut, id, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await getUserService({ rut, id, email });

    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [user, userError] = await updateUserService({ rut, id, email }, body);

    if (userError)
      return handleErrorClient(
        res,
        400,
        "Error modificando al usuario",
        userError,
      );

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [userDelete, errorUserDelete] = await deleteUserService({
      rut,
      id,
      email,
    });

    if (errorUserDelete)
      return handleErrorClient(
        res,
        404,
        "Error eliminado al usuario",
        errorUserDelete,
      );

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function importUsers(req, res) {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return handleErrorClient(res, 400, "Debes enviar un array de usuarios");
    }

    const validUsers = [];
    const invalidUsers = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const { value, error } = userCreateValidation.validate(user, {
        abortEarly: false,
      });
      if (error) {
        // Mapear cada error a su campo y mensaje
        const fieldErrors = error.details?.map((e) => ({
          field: e.path && e.path.length > 0 ? e.path[0] : "unknown",
          message: e.message,
        })) || [{ field: "unknown", message: error.message }];
        invalidUsers.push({ index: i, user, error: fieldErrors });
        continue;
      }
      validUsers.push({ ...value, __originalIndex: i });
    }

    if (validUsers.length === 0) {
      return handleErrorClient(
        res,
        400,
        "Ningún usuario es válido para importar",
        { invalidUsers },
      );
    }

    const [importedUsers, error] = await importUsersService(validUsers);

    // Si no se importó ninguno, error
    if (!importedUsers || importedUsers.length === 0) {
      return handleErrorClient(
        res,
        400,
        error?.invalidUsers
          ? "Ningún usuario fue importado"
          : error || "Ningún usuario fue importado",
        error?.invalidUsers ? { invalidUsers: error.invalidUsers } : undefined,
      );
    }

    // Mapear los importados a su índice original
    const importedWithIndex = (importedUsers || []).map((u) => {
      // Buscar el índice original usando rut/email
      const match = validUsers.find(
        (v) => v.rut === u.rut && v.email === u.email,
      );
      return { ...u, index: match ? match.__originalIndex : null };
    });

    // Siempre responde 201 si hay al menos uno importado
    return handleSuccess(res, 201, "Usuarios importados correctamente", {
      imported: importedWithIndex,
      invalidUsers,
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
