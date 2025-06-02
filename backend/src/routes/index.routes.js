"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import preguntasRoutes from "./preguntas.routes.js";
import respuestasRoutes from "./respuestas.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/preguntas", preguntasRoutes)
    .use("/respuestas", respuestasRoutes);

export default router;