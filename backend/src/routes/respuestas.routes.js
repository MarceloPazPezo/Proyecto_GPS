"use strict";
import { Router } from "express";

import {
    createRespuesta,
    getRespuesta,
    getRespuestas,
    updateRespuesta,
    deleteRespuesta
} from "../controllers/respuestas.controller.js";
const router = Router();
router
  .get("/:id", getRespuesta)
  .get("/pregunta/:idPreguntas", getRespuestas)
  .post("/", createRespuesta)
  .patch("/update/:id", updateRespuesta)
  .delete("/del/:id", deleteRespuesta);
export default router;