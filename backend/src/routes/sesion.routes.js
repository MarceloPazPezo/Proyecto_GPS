import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { createSesion,getSesion,getSesiones } from "../controllers/sesion.controller.js";

const router=Router();
router.use(authenticateJwt)
    .get("/",getSesion)
    .post("/",createSesion)
    .get("/all",getSesiones);

export default router;