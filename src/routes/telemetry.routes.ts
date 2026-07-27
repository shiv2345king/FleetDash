import { Router } from "express";
import { ingestTelemetry } from "../controllers/telementry.controller";

const router = Router();
router.post("/ingest", ingestTelemetry);

export default router;