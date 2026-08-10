
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