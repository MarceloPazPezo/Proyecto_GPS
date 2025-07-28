import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey } from "./config/configEnv.js";
import { passportJwtSetup } from "./auth/passport.auth.js";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(
  urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(
  json({
    limit: "1mb",
  })
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
  })
);

app.use(passport.initialize());
app.use(passport.session());

passportJwtSetup();

app.use("/api", indexRoutes);

export default app;
