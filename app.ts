import express from "express";
import cors from "cors";
import telemetryRoutes from "./src/routes/telemetry.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/telemetry", telemetryRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
import geofenceRoutes from "./src/routes/geofence.routes";
app.use("/api/geofence", geofenceRoutes);

export { app };