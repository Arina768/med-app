import express from "express";
import * as http from "http";
import session from "express-session";

import cookieParser from "cookie-parser";
import "reflect-metadata";
import { connectDB } from "./db/index.js";
import cors from "cors";
import checkAdminMiddleware from "./middlewares/checkAdminRole.js";

import dotenv from "dotenv";
import errorMiddleware from "./middlewares/errorHandler.js";
import authMiddleware from "./middlewares/checkToken.js";

import { authRoute } from "./controllers/auth.js";
import { servicesRoute } from "./controllers/medServices.js";
import { userRoute } from "./controllers/user.js";
import { adminRoute } from "./controllers/admin.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

connectDB();
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(errorMiddleware);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/services", servicesRoute);
app.use("/user", authMiddleware, userRoute);
app.use("/admin", authMiddleware, checkAdminMiddleware, adminRoute);

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
