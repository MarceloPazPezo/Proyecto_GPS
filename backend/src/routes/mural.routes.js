import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
    createMural,
    deleteMural,
    getMural,
    getMuralesByUser,
    saveMuralNotas,
    updateMural,
} from "../controllers/stickNotes.controller.js";
const router=Router();

router.use(authenticateJwt);

router.post("/crearMural", createMural);        
router.get("/muralUsuario/:idUser", getMuralesByUser);    
router.get("/:id", getMural);        
router.put("/:id", updateMural);      
router.delete("/:id", deleteMural);
router.put("/save/:idMural", saveMuralNotas);  

export default router;