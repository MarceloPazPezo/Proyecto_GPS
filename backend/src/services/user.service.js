"use strict";
import User from "../entity/user.entity.js";
import { normalizarRut } from "../helpers/rut.helper.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";
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
      const originalIndex = user.__originalIndex !== undefined ? user.__originalIndex : i;
      
      // Normalizar RUT
      user.rut = normalizarRut(user.rut);

      // Verificar duplicados internos en el archivo
      const fieldErrors = [];
      
      if (user.rut && seenRuts[user.rut] !== undefined) {
        const duplicateOriginalIndex = usersArray[seenRuts[user.rut]].__originalIndex !== undefined 
          ? usersArray[seenRuts[user.rut]].__originalIndex 
          : seenRuts[user.rut];
        fieldErrors.push({ 
          field: 'rut', 
          message: `Rut duplicado en archivo (fila ${duplicateOriginalIndex + 1})` 
        });
      } else {
        seenRuts[user.rut] = i;
      }
      
      if (user.email && seenEmails[user.email] !== undefined) {
        const duplicateOriginalIndex = usersArray[seenEmails[user.email]].__originalIndex !== undefined 
          ? usersArray[seenEmails[user.email]].__originalIndex 
          : seenEmails[user.email];
        fieldErrors.push({ 
          field: 'email', 
          message: `Email duplicado en archivo (fila ${duplicateOriginalIndex + 1})` 
        });
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
        invalidUsers.push({ 
          index: originalIndex, // Usar el índice original
          user: { ...user, __originalIndex: undefined }, // Limpiar el índice interno
          error: fieldErrors 
        });
        continue;
      }

      // Limpiar el índice interno antes de crear el usuario
      const { __originalIndex, ...cleanUser } = user;
      cleanUser.password = await encryptPassword(cleanUser.password);
      validUsers.push(cleanUser);
    }

    const createdUsers = [];

    if (validUsers.length > 0) {
      for (const user of validUsers) {
        const newUser = userRepository.create({
          nombreCompleto: user.nombreCompleto,
          rut: user.rut,
          email: user.email,
          password: user.password,
          rol: user.rol || "usuario",
          idCarrera: user.idCarrera || null,
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
      ? encargado.carrerasEncargado.map(c => Number(c.id ?? c))
      : [];
    
    // console.log('Carreras del encargado:', carrerasIds);
    
    // Si no tiene carreras asignadas, retornar array vacío
    if (carrerasIds.length === 0) {
      return [[], null];
    }
    
    // Buscar usuarios cuyo idCarrera esté en carrerasIds usando In operator
    const usuarios = await userRepository.find({
      where: {
        idCarrera: carrerasIds.length === 1 ? carrerasIds[0] : In(carrerasIds)
      },
      relations: ["idCarrera"]
    });
    
    // console.log('Usuarios encontrados:', usuarios.length);
    
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
    console.error('Error en getMisUsuariosService:', error);
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

    // Importar el servicio de carrera
    const { getCarreraService } = await import("./carrera.service.js");

    // Para marcar duplicados dentro del archivo
    const seenRuts = {};
    const seenEmails = {};

    for (let i = 0; i < usersArray.length; i++) {
      const user = usersArray[i];
      const errors = [];

      // Normalizar RUT
      let normalizedRut = user.rut ? normalizarRut(user.rut) : null;

      // Validar duplicados dentro del archivo
      if (normalizedRut) {
        if (seenRuts[normalizedRut]) {
          errors.push({ field: "rut", message: `RUT duplicado en el archivo (fila ${seenRuts[normalizedRut] + 1})` });
        } else {
          seenRuts[normalizedRut] = i;
        }
      }

      if (user.email) {
        if (seenEmails[user.email]) {
          errors.push({ field: "email", message: `Email duplicado en el archivo (fila ${seenEmails[user.email] + 1})` });
        } else {
          seenEmails[user.email] = i;
        }
      }

      // Validar duplicados en la base de datos
      if (normalizedRut) {
        const existingRut = await userRepository.findOne({ where: { rut: normalizedRut } });
        if (existingRut) {
          errors.push({ field: "rut", message: "RUT ya está registrado en la base de datos" });
        }
      }

      if (user.email) {
        const existingEmail = await userRepository.findOne({ where: { email: user.email } });
        if (existingEmail) {
          errors.push({ field: "email", message: "Email ya está registrado en la base de datos" });
        }
      }

      // Excluir roles no permitidos
      if (["administrador", "encargado_carrera"].includes(user.rol)) {
        errors.push({ field: "rol", message: "No puedes importar usuarios con rol administrador o encargado_carrera" });
      }

      // Si se proporciona carreraCodigo, buscar la carrera
      let carreraId = null;
      
      // Priorizar carreraCodigo sobre idCarrera
      if (user.carreraCodigo && user.carreraCodigo.trim() !== '') {
        const [carrera, carreraError] = await getCarreraService({ codigo: user.carreraCodigo });
        if (carreraError || !carrera) {
          errors.push({ field: "carreraCodigo", message: `Carrera con código '${user.carreraCodigo}' no encontrada` });
        } else {
          carreraId = carrera.id;
        }
      } else if (user.idCarrera) {
        // Solo usar idCarrera si no hay carreraCodigo
        carreraId = user.idCarrera;
      }

      // Verificar que el encargado puede gestionar esta carrera (solo si hay carreraId)
      if (carreraId) {
        const carrerasIds = Array.isArray(encargado.carrerasEncargado)
          ? encargado.carrerasEncargado.map(c => Number(c.id ?? c))
          : [];
        
        if (!carrerasIds.includes(Number(carreraId))) {
          errors.push({ field: "carreraCodigo", message: "No tienes permisos para gestionar esta carrera" });
        }
      }

      if (errors.length > 0) {
        invalidUsers.push({ index: i, user, error: errors });
        continue;
      }

      // Crear usuario válido con el ID de carrera correcto y RUT normalizado
      const validUser = {
        nombreCompleto: user.nombreCompleto,
        rut: normalizedRut,
        email: user.email,
        password: await encryptPassword(user.password || 'user1234'),
        rol: user.rol || 'usuario',
        idCarrera: carreraId
      };
      
      validUsers.push({ ...validUser, originalIndex: i });
    }

    const createdUsers = [];
    if (validUsers.length > 0) {
      for (const user of validUsers) {
        const { originalIndex, ...userData } = user;
        const newUser = userRepository.create(userData);
        const savedUser = await userRepository.save(newUser);
        const { password, ...userWithoutPassword } = savedUser;
        createdUsers.push({ ...userWithoutPassword, index: originalIndex });
      }
    }

    if (createdUsers.length === 0) {
      return [null, { invalidUsers }];
    }
    return [createdUsers, { invalidUsers }];
  } catch (error) {
    console.error("Error al importar usuarios:", error);
    return [null, "Error interno del servidor al importar usuarios."];
  }
}
