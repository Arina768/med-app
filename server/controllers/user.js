import express from "express";
import {
  findUser,
  getAllServices,
  updatePassword,
  updateProfile,
  addBasicServices,
  addNewService,
  modifyAppointment,
} from "../services/user";
const router = express.Router();

router.post("/service", addNewService);
router.get("/service/:_id", getAllServices);
router.delete("/service", modifyAppointment);
router.put("/service", modifyAppointment);
router.post("/service/done", modifyAppointment);

router.post("/form", addBasicServices);

router.get("/:_id", findUser);
router.put("/", updateProfile);
router.post("/password", updatePassword);

export { router as userRoute };
