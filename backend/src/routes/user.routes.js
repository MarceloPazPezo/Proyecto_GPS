"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  importUsers,
  createUser,
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .get("/", getUsers);
router
  .post("/", authorizeRoles("administrador"), createUser)
  .get("/detail/", authorizeRoles("administrador"), getUser)
  .patch("/detail/", authorizeRoles("administrador"), updateUser)
  .delete("/detail/", authorizeRoles("administrador"), deleteUser)
  .post("/import", authorizeRoles("administrador"), importUsers);

export default router;