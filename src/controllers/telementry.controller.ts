import { Request, Response } from "express";
import { ingestionPool } from "../workers/workerPool";
import { TelemetryBucket } from "../model/BucketModel";
import { redisPublisher, TELEMETRY_CHANNEL } from "../config/redis";

export async function ingestTelemetry(req: Request, res: Response) {
  const payloads = Array.isArray(req.body) ? req.body : [req.body];

  try {
    const processed = await Promise.all(payloads.map((p) => ingestionPool.run(p)));

    const bulkOps = processed.map((p) => ({
      updateOne: {
        filter: { vehicleId: p.vehicleId, hourBucket: new Date(p.hourBucket) },
        update: {
          $push: { readings: p.reading },
          $inc: { count: 1 },
          $min: { firstTs: new Date(p.reading.ts) },
          $max: { lastTs: new Date(p.reading.ts) },
          $setOnInsert: { vehicleId: p.vehicleId, hourBucket: new Date(p.hourBucket) },
        },
        upsert: true,
      },
    }));

    await TelemetryBucket.bulkWrite(bulkOps, { ordered: false });

    // Publish each reading to Redis for the Socket.io layer to pick up and broadcast
    for (const p of processed) {
      redisPublisher.publish(
        TELEMETRY_CHANNEL,
        JSON.stringify({
          vehicleId: p.vehicleId,
          lat: p.reading.lat,
          lng: p.reading.lng,
          speed: p.reading.speed,
          heading: p.reading.heading,
          ts: new Date(p.reading.ts).getTime(),
        })
      );
    }

    res.status(200).json({ ingested: processed.length });
  } catch (err) {
    console.error("Ingestion error:", err);
    res.status(500).json({ error: "Ingestion failed" });
  }
}