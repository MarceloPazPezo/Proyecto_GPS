import Router from "express"
import { getQuizzesByUser, join } from "../controllers/EX.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js"

const router=Router()
router.post("/join",join);
router.use(authenticateJwt)
router.get("/quizzes/:idUser",getQuizzesByUser);


export default router;