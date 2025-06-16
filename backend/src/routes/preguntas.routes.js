"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

import{
    createPregunta,
    getPregunta,
    getPreguntas,
    updatePregunta,
    deletePregunta,
} from "../controllers/preguntas.controller.js";

const router = Router();
router
  .use(authenticateJwt) 
  .get("/cuestionario/:idCuestionario", getPreguntas)
  .get("/:id", getPregunta)
  .post("/", createPregunta)
  .patch("/update/:id", updatePregunta)
  .delete("/del/:id", deletePregunta)


export default router;