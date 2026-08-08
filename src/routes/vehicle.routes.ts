// routes/vehicle.route.ts
import { Router } from "express";
import { getLatestVehiclePositions } from "../controllers/vehicle,controller";

const router = Router();
router.get("/latest", getLatestVehiclePositions);

export default router;