import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
    createMural,
    deleteMural,
    getMural,
    getMuralesByUser,
    updateMural,
} from "../controllers/stickNotes.controller.js";
const router=Router();

router.use(authenticateJwt);

router.post("/crearMural", createMural);        
router.get("/muralUsuario/:idUser", getMuralesByUser);    
router.get("/:id", getMural);        
router.put("/:id", updateMural);      
router.delete("/:id", deleteMural);   

export default router;