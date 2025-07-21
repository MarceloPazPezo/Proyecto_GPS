"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
  deleteCarrera,
  getCarrera,
  getCarreras,
  updateCarrera,
  importCarreras,
  createCarrera,
  getMyCarreras
} from "../controllers/carrera.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .get("/", getCarreras);
router
  .post("/", authorizeRoles("administrador"), createCarrera)
  .get("/detail/", authorizeRoles("administrador"), getCarrera)
  .patch("/detail/", authorizeRoles("administrador"), updateCarrera)
  .delete("/detail/", authorizeRoles("administrador"), deleteCarrera)
  .post("/import", authorizeRoles("administrador"), importCarreras)
  .get("/encargado/", authorizeRoles("encargado_carrera"), getMyCarreras);

export default router;