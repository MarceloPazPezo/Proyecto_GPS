import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { getCompartidos,
    createCompartido,
    getCompartido,
    deleteCompartido } from "../controllers/compartido.controller.js"
const router=Router();

router.use(authenticateJwt);
router.get("/:idUser",getCompartidos);
router.get("/get/",getCompartido);
router.post("/",createCompartido);
router.delete("/",deleteCompartido);

export default router;
