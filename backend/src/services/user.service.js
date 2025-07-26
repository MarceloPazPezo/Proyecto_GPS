"use strict";
import User from "../entity/user.entity.js";
import { normalizarRut } from "../helpers/rut.helper.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createUserService(body) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    let bodyRut = body.rut ? normalizarRut(body.rut) : undefined;
    // Buscar duplicados por separado
    const errors = [];
    if (bodyRut) {
      const existingRut = await userRepository.findOne({ where: { rut: bodyRut } });
      if (existingRut) {
        errors.push({ field: 'rut', message: 'El rut ya está registrado' });
      }
    }
    if (body.email) {
      const existingEmail = await userRepository.findOne({ where: { email: body.email } });
      if (existingEmail) {
        errors.push({ field: 'email', message: 'El email ya está registrado' });
      }
    }
    if (errors.length > 0) {
      return [null, { status: 'Client error', message: 'Error creando al usuario', details: errors }];
    }
    const newUser = userRepository.create({
      nombreCompleto: body.nombreCompleto,
      rut: bodyRut,
      email: body.email,
      password: await encryptPassword(body.password),
      rol: body.rol || "usuario", // Default to 'usuario' if no role is provided
      idCarrera: body.idCarrera ? Number(body.idCarrera) : undefined,
    });
    const savedUser = await userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser; // Exclude the password
    return [userWithoutPassword, null];
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return [null, { status: 'Server error', message: 'Error interno del servidor al crear el usuario.' }];
  }
}

export async function getUserService(query) {
  try {
    let { rut, id, email } = query;
    if (rut) rut = normalizarRut(rut);

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService(rol) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    let users;
    if (rol) {
      users = await userRepository.find({ where: { rol }, relations: ["idCarrera"] });
    } else {
      users = await userRepository.find();
    }

    if (!users || users.length === 0) return [[], null];

    const usuariosConCarrera = users.map(({ password, idCarrera, ...user }) => ({
      ...user,
      idCarrera: idCarrera?.id ?? idCarrera,
      carreraCodigo: idCarrera?.codigo ?? null,
      carreraNombre: idCarrera?.nombre ?? null
    }));

    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    let { id, rut, email } = query;
    if (rut) rut = normalizarRut(rut);

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    let bodyRut = body.rut ? normalizarRut(body.rut) : undefined;
    const existingUser = await userRepository.findOne({
      where: [{ rut: bodyRut }, { email: body.email }],
    });

    if (existingUser && existingUser.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.password,
      );

      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto,
      rut: bodyRut,
      email: body.email,
      rol: body.rol,
      idCarrera: body.idCarrera ? Number(body.idCarrera) : undefined,
      updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id: userFound.id }, dataUserUpdate);

    const userData = await userRepository.findOne({
      where: { id: userFound.id },
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    let { id, rut, email } = query;
    if (rut) rut = normalizarRut(rut);

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function importUsersService(usersArray) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const validUsers = [];
    const invalidUsers = [];

    // Para marcar duplicados dentro del archivo, primero revisa los ruts/emails repetidos en el array
    const seenRuts = {};
    const seenEmails = {};
    for (let i = 0; i < usersArray.length; i++) {
      const user = usersArray[i];
      user.rut = normalizarRut(user.rut);

      // Verificar duplicados internos en el archivo
      const fieldErrors = [];
      if (user.rut && seenRuts[user.rut] !== undefined) {
        fieldErrors.push({ field: 'rut', message: `Rut duplicado en archivo (fila ${seenRuts[user.rut] + 1})` });
      } else {
        seenRuts[user.rut] = i;
      }
      if (user.email && seenEmails[user.email] !== undefined) {
        fieldErrors.push({ field: 'email', message: `Email duplicado en archivo (fila ${seenEmails[user.email] + 1})` });
      } else {
        seenEmails[user.email] = i;
      }

      // Verificar duplicados en la base de datos
      const existingRut = await userRepository.findOne({ where: { rut: user.rut } });
      if (existingRut) {
        fieldErrors.push({ field: 'rut', message: 'Rut duplicado en base de datos' });
      }
      const existingEmail = await userRepository.findOne({ where: { email: user.email } });
      if (existingEmail) {
        fieldErrors.push({ field: 'email', message: 'Email duplicado en base de datos' });
      }
      if (fieldErrors.length > 0) {
        invalidUsers.push({ index: i, user, error: fieldErrors });
        continue;
      }

      user.password = await encryptPassword(user.password);
      validUsers.push(user);
    }

    const createdUsers = [];

    if (validUsers.length > 0) {
      for (const user of validUsers) {
        const newUser = userRepository.create({
          nombreCompleto: user.nombreCompleto,
          rut: user.rut,
          email: user.email,
          password: user.password,
          rol: "usuario",
        });

        const savedUser = await userRepository.save(newUser);
        const { password, ...userWithoutPassword } = savedUser; // Excluir la contraseña
        createdUsers.push(userWithoutPassword);
      }
    }

    // Si no se creó ningún usuario válido, error
    if (createdUsers.length === 0) {
      return [null, { invalidUsers }];
    }

    // Si hay al menos uno creado, nunca devolver error
    return [createdUsers, { invalidUsers }];
  } catch (error) {
    console.error("Error al importar usuarios:", error);
    return [null, "Error interno del servidor al importar usuarios."];
  }
}

export async function getMisUsuariosService(encargado) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    // Obtener solo los ids de las carreras
    const carrerasIds = Array.isArray(encargado.carrerasEncargado)
      ? encargado.carrerasEncargado.map(c => c.id ?? c)
      : [];
    // Buscar usuarios cuyo idCarrera esté en carrerasIds
    const usuarios = await userRepository.find({
      where: carrerasIds.length > 0 ? carrerasIds.map(id => ({ idCarrera: id })) : {},
      relations: ["idCarrera"]
    });
    if (!usuarios || usuarios.length === 0) return [[], null];
    // Excluir la contraseña y agregar info de carrera
    const usuariosConCarrera = usuarios.map(({ password, idCarrera, ...user }) => ({
      ...user,
      idCarrera: idCarrera?.id ?? idCarrera,
      carreraCodigo: idCarrera?.codigo ?? null,
      carreraNombre: idCarrera?.nombre ?? null
    }));

    return [usuariosConCarrera, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getMiUsuarioService(encargado, id) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const usuario = await userRepository.findOne({
      where: {
        id: id,
        idCarrera: encargado.carrerasEncargado
      },
      relations: ["idCarrera"]
    });
    if (!usuario) return [null, "Usuario no encontrado o no autorizado"];
    return [usuario, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function createMiUsuarioService(encargado, body) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    let bodyRut = body.rut ? normalizarRut(body.rut) : undefined;
    // Buscar duplicados por separado
    const errors = [];
    if (bodyRut) {
      const existingRut = await userRepository.findOne({ where: { rut: bodyRut } });
      if (existingRut) {
        errors.push({ field: 'rut', message: 'El rut ya está registrado' });
      }
    }
    if (body.email) {
      const existingEmail = await userRepository.findOne({ where: { email: body.email } });
      if (existingEmail) {
        errors.push({ field: 'email', message: 'El email ya está registrado' });
      }
    }
    if (errors.length > 0) {
      return [null, { status: 'Client error', message: 'Error creando al usuario', details: errors }];
    }

    const carrerasIds = Array.isArray(encargado.carrerasEncargado)
      ? encargado.carrerasEncargado.map(c => Number(c.id ?? c))
      : [];
    if (!carrerasIds.includes(Number(body.idCarrera))) {
      return [null, "No puedes crear usuarios en carreras que no gestionas"];
    }
    
    const newUser = userRepository.create({
      nombreCompleto: body.nombreCompleto,
      rut: bodyRut,
      email: body.email,
      password: await encryptPassword(body.password),
      rol: body.rol || "usuario",
      idCarrera: carrerasIds.includes(Number(body.idCarrera)) ? body.idCarrera : undefined,
    });
    const savedUser = await userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser; // Exclude the password
    return [userWithoutPassword, null];
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return [null, { status: 'Server error', message: 'Error interno del servidor al crear el usuario.' }];
  }
}

export async function updateMiUsuarioService(encargado, id, body) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const usuario = await userRepository.findOne({
      where: {
        id: id,
        idCarrera: encargado.carrerasEncargado
      }
    });
    if (!usuario) return [null, "Usuario no encontrado o no autorizado"];
    Object.assign(usuario, body);
    await userRepository.save(usuario);
    return [usuario, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function deleteMiUsuarioService(rut) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    let bodyRut = rut ? normalizarRut(rut) : undefined;
    const usuario = await userRepository.findOne({
      where: {
        rut: bodyRut,
      }
    });
    if (!usuario) return [null, "Usuario no encontrado o no autorizado"];
    await userRepository.remove(usuario);
    const { password, ...dataUser } = usuario;
    return [dataUser, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function importMisUsuariosService(encargado, usersArray) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const validUsers = [];
    const invalidUsers = [];

    for (let i = 0; i < usersArray.length; i++) {
      const user = usersArray[i];
      // Excluir roles no permitidos
      if (["administrador", "encargado_carrera"].includes(user.rol)) {
        invalidUsers.push({ index: i, user, error: [{ field: "rol", message: "No puedes importar usuarios con rol administrador o encargado_carrera" }] });
        continue;
      }
      // Solo permite crear usuarios en carreras que gestiona
      if (!encargado.carrerasEncargado.includes(user.idCarrera)) {
        invalidUsers.push({ index: i, user, error: [{ field: "idCarrera", message: "No puedes importar usuarios en carreras que no gestionas" }] });
        continue;
      }
      validUsers.push(user);
    }

    const createdUsers = [];
    if (validUsers.length > 0) {
      for (const user of validUsers) {
        const newUser = userRepository.create(user);
        await userRepository.save(newUser);
        createdUsers.push(newUser);
      }
    }

    if (createdUsers.length === 0) {
      return [null, { invalidUsers }];
    }
    return [createdUsers, { invalidUsers }];
  } catch (error) {
    return [null, "Error interno del servidor al importar usuarios."];
  }
}
