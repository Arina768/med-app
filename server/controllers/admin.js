import express from "express";
import { deleteService, saveService } from "../services/medServices";

const router = express.Router();

router.post("/service", saveService);
router.delete("/service", deleteService);

export { router as adminRoute };
