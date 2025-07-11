"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
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
  .get("/", getUsers)
  .use(isAdmin);

router
  .post("/", createUser)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser)
  .post("/import", importUsers);

export default router;