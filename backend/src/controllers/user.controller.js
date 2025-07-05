"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
  importUsersService
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
  userCreateValidation
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

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
    handleErrorServer(
      res,
      500,
      error.message,
    );
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

    if (userError) return handleErrorClient(res, 400, "Error modificando al usuario", userError);

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

    if (errorUserDelete) return handleErrorClient(res, 404, "Error eliminado al usuario", errorUserDelete);

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
    console.log("Validando usuarios para importar...", users);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const { value, error } = userCreateValidation.validate(user);
      if (error) {
        invalidUsers.push({ index: i, user, error: error.message });
        continue;
      }
      validUsers.push(value);
    }

    if (validUsers.length === 0) {
      return handleErrorClient(res, 400, {
        message: "Ningún usuario es válido para importar",
        invalidUsers,
      });
    }

    const [importedUsers, error] = await importUsersService(validUsers);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Usuarios importados correctamente", {
      imported: importedUsers,
      invalidUsers,
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}