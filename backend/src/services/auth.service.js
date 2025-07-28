"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { ILike } from "typeorm";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email: ILike(email) },
      relations: ["carrerasEncargado"],
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    //console.log(userFound);
    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    if(userFound.rol==='usuario')
      return [null, createErrorMessage("rol", "No tiene acceso a estas caracteristicas")];

    let carrerasEncargado = [];
    if (userFound.rol === "encargado_carrera" && userFound.carrerasEncargado) {
      // Devuelve solo el id de cada carrera encargada
      carrerasEncargado = userFound.carrerasEncargado.map(c => c.id);
    }
    const payload = {
      id: userFound.id,
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
      carrerasEncargado,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}
