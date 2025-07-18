import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import{
    createNote,
    deleteNote,
    getStickNote,
    getStickNotes,
    updateNote,
} from "../controllers/stickNotes.controller.js";

const router=Router();


router.post("/crearNota",createNote);
router.get("/mural/:idMural",getStickNotes);
router.get("/nota/:id",getStickNote);
router.put("/:id",updateNote);
router.delete("/:id",deleteNote);

export default router;