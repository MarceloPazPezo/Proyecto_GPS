"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

import {
    createRespuesta,
    getRespuesta,
    getRespuestas,
    updateRespuesta,
    deleteRespuesta,
    addLotepRespuestas
} from "../controllers/respuestas.controller.js";
const router = Router();
router
  .use(authenticateJwt) 
  .get("/:id", getRespuesta)
  .get("/pregunta/:idPreguntas", getRespuestas)
  .post("/", createRespuesta)
  .patch("/update/:id", updateRespuesta)
  .delete("/del/:id", deleteRespuesta)
  .post("/addLotepRespuestas", addLotepRespuestas);

export default router;