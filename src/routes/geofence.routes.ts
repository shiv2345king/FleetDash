import { Router } from "express";
import { Geofence } from "../model/geofenc.model";
import { Alert } from "../model/alert.model";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const geofence = await Geofence.create(req.body);
    res.status(201).json(geofence);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.get("/", async (_req, res) => {
  const zones = await Geofence.find();
  res.json(zones);
});

router.get("/alerts", async (_req, res) => {
  const alerts = await Alert.find().sort({ triggeredAt: -1 }).limit(50);
  res.json(alerts);
});

export default router;