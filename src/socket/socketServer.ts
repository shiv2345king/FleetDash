import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import {
  redisSubscriber,
  TELEMETRY_CHANNEL,
} from "../config/redis";

const ALERT_CHANNEL = "telemetry:alerts";

export function initSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`=> Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`=> Client disconnected: ${socket.id}`);
    });
  });

  // Subscribed to the channels
  redisSubscriber.subscribe(
    TELEMETRY_CHANNEL,
    ALERT_CHANNEL,
    (err) => {
      if (err) {
        console.error("Redis subscribe failed:", err);
        return;
      }

      console.log(
        `=> Subscribed to Redis channels: ${TELEMETRY_CHANNEL}, ${ALERT_CHANNEL}`
      );
    }
  );

  redisSubscriber.on("message", (channel, message) => {
    try {
      const payload = JSON.parse(message);

      // Vehicle telemetry
      if (channel === TELEMETRY_CHANNEL) {
        io.emit("telemetry:update", payload);
      }

      // Geofence alert
      if (channel === ALERT_CHANNEL) {
        io.emit("telemetry:alert", payload);
      }
    } catch (err) {
      console.error(
        "Failed to process Redis message:",
        err
      );
    }
  });

  return io;
}