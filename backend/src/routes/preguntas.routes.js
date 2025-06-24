"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import upload from "../middlewares/upload.middleware.js";

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
  .post("/", upload.single('imagenPregunta'), createPregunta)
  .patch("/update/:id", upload.single('imagenPregunta'), updatePregunta)
  .delete("/del/:id", deletePregunta)


export default router;