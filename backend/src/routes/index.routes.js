"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import preguntasRoutes from "./preguntas.routes.js";
import respuestasRoutes from "./respuestas.routes.js";
import quizRoutes from "./cuestionario.routes.js";
import shareRoutes from "./compartido.routes.js";
import EXRoutes from "./EX.routes.js";
import muralRoutes from "./mural.routes.js";
import notasRoute from "./notes.routes.js";
import carreraRoutes from "./carrera.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/preguntas", preguntasRoutes)
  .use("/respuestas", respuestasRoutes)
  .use("/quiz", quizRoutes)
  .use("/share", shareRoutes)
  .use("/notas", notasRoute)
  .use("/mural", muralRoutes)
  .use("/EX", EXRoutes)
  .use("/carrera", carreraRoutes);

export default router;
