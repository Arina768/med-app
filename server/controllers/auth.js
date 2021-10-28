import express from "express";

import { body } from "express-validator";
import { loginUser, refreshToken, registerUser } from "../services/auth";

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 4 }),
  registerUser
);
router.post("/login", loginUser);
router.post("/token", refreshToken);

export { router as authRoute };
