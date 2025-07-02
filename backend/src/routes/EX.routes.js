import Router from "express"
import { getQuizzesByUser } from "../controllers/EX.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js"

const router=Router()

router.use(authenticateJwt)
router.get("/quizzes/:idUser",getQuizzesByUser);

export default router;