import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { dbConnect } from "../db/dbConnect";
import { redisPublisher, redisSubscriber } from "../config/redis";
import { ingestionPool } from "../workers/workerPool";
import { pendingGeofenceChecks } from "../controllers/telementry.controller";

beforeAll(async () => {
  await dbConnect();
});

afterAll(async () => {
  await Promise.allSettled([...pendingGeofenceChecks]);
  await ingestionPool.destroy();
  await redisPublisher.quit();
  await redisSubscriber.quit();
  await mongoose.connection.close();
});

describe("POST /api/telemetry/ingest", () => {
  it("accepts a valid telemetry reading", async () => {
    const res = await request(app).post("/api/telemetry/ingest").send({
      vehicleId: "test-vehicle",
      lat: 22.5,
      lng: 88.35,
      speed: 40,
      heading: 90,
    });
    expect(res.status).toBe(200);
    expect(res.body.ingested).toBe(1);
  });

  it("rejects an invalid payload", async () => {
    const res = await request(app).post("/api/telemetry/ingest").send({
      vehicleId: "test-vehicle",
      lat: 999,
      lng: 88.35,
    });
    expect(res.status).toBe(500);
  });
});