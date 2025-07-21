"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  importUsers,
  createUser,
  getMisUsuarios,
  createMiUsuario,
  updateMiUsuario,
  deleteMiUsuario,
  getMiUsuario,
  importMisUsuarios
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .get("/", getUsers);
  
router
  .get("/mis-usuarios", authorizeRoles("encargado_carrera"), getMisUsuarios)
  .post("/mis-usuarios", authorizeRoles("encargado_carrera"), createMiUsuario)
  .get("/mis-usuarios/detail/", authorizeRoles("encargado_carrera"), getMiUsuario)
  .patch("/mis-usuarios/detail/", authorizeRoles("encargado_carrera"), updateMiUsuario)
  .delete("/mis-usuarios/detail/", authorizeRoles("encargado_carrera"), deleteMiUsuario)
  .post("/mis-usuarios/import", authorizeRoles("encargado_carrera"), importMisUsuarios);

router
  .post("/", authorizeRoles("administrador"), createUser)
  .get("/detail/", authorizeRoles("administrador"), getUser)
  .patch("/detail/", authorizeRoles("administrador"), updateUser)
  .delete("/detail/", authorizeRoles("administrador"), deleteUser)
  .post("/import", authorizeRoles("administrador"), importUsers);

export default router;