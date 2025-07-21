"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
  importUsersService,
  createUserService,
  getMisUsuariosService,
  createMiUsuarioService,
  updateMiUsuarioService,
  deleteMiUsuarioService,
  getMiUsuarioService,
  importMisUsuariosService,
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
    const [user, errorUser] = await createUserService(body);
    if (errorUser) {
      // Si el error viene con details, usar ese formato
      if (errorUser.details) {
        return handleErrorClient(
          res,
          400,
          errorUser.message || "Error creando al usuario",
          errorUser.details,
        );
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
    const { rol } = req.query;
    const [users, errorUsers] = await getUsersService(rol);

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

export async function getMiUsuario(req, res) {
  try {
    const encargado = req.user;
    const { id } = req.query;
    // Validar id con Joi
    const { error: queryError } = userQueryValidation.validate({ id });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.details);
    }
    const [usuario, error] = await getMiUsuarioService(encargado, id);
    if (error) return handleErrorClient(res, 404, error);
    handleSuccess(res, 200, "Usuario encontrado", usuario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMisUsuarios(req, res) {
  try {
    const encargado = req.user;
    console.log("Encargado1:", encargado);
    const { error: queryError } = userQueryValidation.validate({
      id: encargado.id,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        error.message,
      );
    }


    if (!encargado || !encargado.id || !encargado.rol) {
      return handleErrorClient(res, 400, "Usuario encargado no válido");
    }

    const [usuarios, error] = await getMisUsuariosService(encargado);
    if (error) return handleErrorClient(res, 404, error);
    handleSuccess(res, 200, "Usuarios encontrados", usuarios);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createMiUsuario(req, res) {
  try {
    const encargado = req.user;
    const { body } = req;
    // Validar datos con Joi
    const { error } = userCreateValidation.validate(body);
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
    if (["administrador", "encargado_carrera"].includes(body.rol)) {
      return handleErrorClient(
        res,
        400,
        "No puedes crear usuarios con rol administrador o encargado_carrera",
        [{ field: "rol", message: "Rol no permitido" }],
      );
    }
    const [usuario, errorService] = await createMiUsuarioService(
      encargado,
      body,
    );
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 201, "Usuario creado correctamente", usuario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateMiUsuario(req, res) {
  try {
    const encargado = req.user;
    const { id } = req.query;
    const { body } = req;
    // Validar id con Joi
    const { error: queryError } = userQueryValidation.validate({ id });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.details);
    }
    // Validar datos con Joi
    const { error } = userBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        error.details,
      );
    }
    // Validar rol prohibido en actualización
    if (["administrador", "encargado_carrera"].includes(body.rol)) {
      return handleErrorClient(
        res,
        400,
        "No puedes actualizar el usuario a rol administrador o encargado_carrera",
        [{ field: "rol", message: "Rol no permitido" }],
      );
    }
    const [usuario, errorService] = await updateMiUsuarioService(
      encargado,
      id,
      body,
    );
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, "Usuario actualizado correctamente", usuario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteMiUsuario(req, res) {
  try {
    const { id, rut, email } = req.query;
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
    const [usuario, errorService] = await deleteMiUsuarioService(rut);
    if (errorService) return handleErrorClient(res, 404, errorService);
    handleSuccess(res, 200, "Usuario eliminado correctamente", usuario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function importMisUsuarios(req, res) {
  try {
    const encargado = req.user;
    const { usuarios } = req.body;
    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      return res
        .status(400)
        .json({ message: "Debes enviar un array de usuarios" });
    }
    const validUsers = [];
    const invalidUsers = [];
    for (let i = 0; i < usuarios.length; i++) {
      const user = usuarios[i];
      // Validar con Joi
      const { value, error } = userCreateValidation.validate(user, {
        abortEarly: false,
      });
      if (error) {
        const fieldErrors = error.details?.map((e) => ({
          field: e.path && e.path.length > 0 ? e.path[0] : "unknown",
          message: e.message,
        })) || [{ field: "unknown", message: error.message }];
        invalidUsers.push({ index: i, user, error: fieldErrors });
        continue;
      }
      // Validar rol permitido
      if (["administrador", "encargado_carrera"].includes(value.rol)) {
        invalidUsers.push({
          index: i,
          user,
          error: [
            {
              field: "rol",
              message:
                "No puedes importar usuarios con rol administrador o encargado_carrera",
            },
          ],
        });
        continue;
      }
      validUsers.push({ ...value, __originalIndex: i });
    }
    if (validUsers.length === 0) {
      return res
        .status(400)
        .json({
          message: "Ningún usuario es válido para importar",
          invalidUsers,
        });
    }
    const [imported, error] = await importMisUsuariosService(
      encargado,
      validUsers,
    );
    if (!imported) {
      return res
        .status(400)
        .json({ message: "No se importó ningún usuario", error, invalidUsers });
    }
    // Mapear los importados a su índice original
    const importedWithIndex = (imported || []).map((u) => {
      const match = validUsers.find(
        (v) => v.rut === u.rut && v.email === u.email,
      );
      return { ...u, index: match ? match.__originalIndex : null };
    });
    return res
      .status(201)
      .json({
        message: "Usuarios importados correctamente",
        imported: importedWithIndex,
        invalidUsers,
        error,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
}
