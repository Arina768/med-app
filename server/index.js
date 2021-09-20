import express from "express";
import * as http from "http";

import cookieParser from "cookie-parser";
import "reflect-metadata";
import { connectDB } from "./db/index.js";

// import { authRoute } from './routes/auth.routes';
// import { profileRoute } from './routes/profile.routes';

// import errorMiddleware from './middlewares/errorHandler';

// import authMiddleware from './middlewares/checkToken';
// import checkAdminMiddleware from './middlewares/checkAdminRole';

// import { adminRoute } from './routes/admin.routes';

import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

connectDB();

app.use(express.json());
app.use(cookieParser());
// app.use('/auth', authRoute);
// app.use('/profile', authMiddleware, profileRoute);
// app.use('/admin', authMiddleware, checkAdminMiddleware, adminRoute);

// app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
