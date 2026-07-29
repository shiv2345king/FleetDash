import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { redisSubscriber, TELEMETRY_CHANNEL } from "../config/redis";
import { encodeReading } from "../utils/binaryEncoder";

export function initSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`=> Client connected: ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`=> Client disconnected: ${socket.id}`);
    });
  });

  // Subscribe once, broadcast every message that comes through Redis
  redisSubscriber.subscribe(TELEMETRY_CHANNEL, (err) => {
    if (err) {
      console.error("Redis subscribe failed:", err);
      return;
    }
    console.log(`=> Subscribed to Redis channel: ${TELEMETRY_CHANNEL}`);
  });

  redisSubscriber.on("message", (channel, message) => {
    if (channel !== TELEMETRY_CHANNEL) return;

    try {
      const payload = JSON.parse(message);
      const binaryBuffer = encodeReading(payload);
      io.emit("telemetry:update", binaryBuffer); // sent as raw binary over the wire
    } catch (err) {
      console.error("Failed to encode/broadcast reading:", err);
    }
  });

  return io;
}