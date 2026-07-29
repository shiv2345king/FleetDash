import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("telemetry:update", (buffer) => {
  console.log("Received binary buffer, length:", buffer.length);
  // decode it manually to verify contents
  const vehicleId = buffer.toString("utf-8", 0, 16).replace(/\0/g, "");
  const lat = buffer.readDoubleLE(16);
  const lng = buffer.readDoubleLE(24);
  console.log("Decoded:", { vehicleId, lat, lng });
});