// Fixed layout, 48 bytes total per reading:
// [0-16)  vehicleId  - 16 bytes UTF-8, padded/truncated
// [16-24) lat        - 8 bytes float64
// [24-32) lng        - 8 bytes float64
// [32-36) speed      - 4 bytes float32
// [36-40) heading    - 4 bytes float32
// [40-48) ts         - 8 bytes float64 (epoch millis)

const VEHICLE_ID_BYTES = 16;
const RECORD_SIZE = 48;

interface ReadingPayload {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ts: number; 
}

export function encodeReading(data: ReadingPayload): Buffer {
  const buf = Buffer.alloc(RECORD_SIZE);

  buf.write(data.vehicleId.slice(0, VEHICLE_ID_BYTES), 0, "utf-8");

  buf.writeDoubleLE(data.lat, 16);
  buf.writeDoubleLE(data.lng, 24);
  buf.writeFloatLE(data.speed, 32);
  buf.writeFloatLE(data.heading, 36);
  buf.writeDoubleLE(data.ts, 40);

  return buf;
}

export function decodeReading(buf: Buffer): ReadingPayload {
  const vehicleId = buf.toString("utf-8", 0, VEHICLE_ID_BYTES).replace(/\0/g, "");
  return {
    vehicleId,
    lat: buf.readDoubleLE(16),
    lng: buf.readDoubleLE(24),
    speed: buf.readFloatLE(32),
    heading: buf.readFloatLE(36),
    ts: buf.readDoubleLE(40),
  };
}