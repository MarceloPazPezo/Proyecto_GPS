"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { initializeMinio } from "./config/configMinio.js";
import { createUsers, createCarreras, createMural, createNotas, createtutor } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import http from 'http'
import { Server } from 'socket.io'
import { socketEvents } from "./services/socket.service.js";

async function setupServer() {
  try {
    const app = express();

    const server = http.createServer(app);

      const io = new Server(server, {
      connectionStateRecovery: {
        maxDisconnectionDuration: 10 * 60 * 1000,
      },
      pingTimeout:60000
    });

    app.disable("x-powered-by");

    app.use(
      cors({
        credentials: true,
        origin: true,
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    );

    app.use(
      json({
        limit: "1mb",
      }),
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passportJwtSetup();

    app.use("/api", indexRoutes);

    io.on('connection',socketEvents);

    server.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await initializeMinio();
    await setupServer();
    await createUsers();
    await createCarreras();
    await createtutor();
    await createMural();
    await createNotas();
    
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );
