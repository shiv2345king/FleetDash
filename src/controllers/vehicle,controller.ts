// controllers/vehicle.controller.ts
import { Request, Response } from "express";
import { TelemetryBucket } from "../model/bucket.model";

export async function getLatestVehiclePositions(_req: Request, res: Response) {
  try {
    const latest = await TelemetryBucket.aggregate([
      { $sort: { vehicleId: 1, hourBucket: -1 } },
      {
        $group: {
          _id: "$vehicleId",
          latestBucket: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          vehicleId: "$_id",
          reading: { $last: "$latestBucket.readings" },
        },
      },
    ]);

    const vehicles = latest.map((v) => ({
      vehicleId: v.vehicleId,
      lat: v.reading.lat,
      lng: v.reading.lng,
      speed: v.reading.speed,
      heading: v.reading.heading,
      ts: v.reading.ts,
    }));

    res.status(200).json(vehicles);
  } catch (err) {
    console.error("Failed to fetch latest positions:", err);
    res.status(500).json({ error: "Failed to fetch vehicle positions" });
  }
}