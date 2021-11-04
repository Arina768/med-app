import express from "express";
import { getServiceById, getServices } from "../services/medServices.js";

const router = express.Router();

router.get("/", getServices);
router.get("/:_id", getServiceById);

export { router as servicesRoute };
