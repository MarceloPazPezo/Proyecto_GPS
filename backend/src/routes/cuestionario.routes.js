import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createCuestionario,
    getCuestionario,
    getCuestionarios,
    deleteCuestionario,
    updateCuestionario,
    addLotepPreguntas,
    obtenerPreguntasYRespuestasController
} from "../controllers/cuestionario.controller.js";



const router=Router();

router.use(authenticateJwt);
router.get("/",getCuestionario);
router.get("/all",getCuestionarios);
router.post("/",createCuestionario);
router.patch("/",updateCuestionario);
router.delete("/",deleteCuestionario);
router.post("/addLote/:idCuestionario", addLotepPreguntas);
router.get("/lote/:idCuestionario", obtenerPreguntasYRespuestasController);

export default router;