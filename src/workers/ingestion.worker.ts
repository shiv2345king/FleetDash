interface RawPayload {
  vehicleId: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  ts?: string;
}

interface ProcessedReading {
  vehicleId: string;
  hourBucket: string;
  reading: { ts: string; lat: number; lng: number; speed: number; heading: number };
}

export default function parseCoordinate(payload: RawPayload): ProcessedReading {
  const { vehicleId, lat, lng, speed = 0, heading = 0 } = payload;

  if (!vehicleId || typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("Invalid coordinate payload");
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error("Coordinate out of range");
  }

  const ts = payload.ts ? new Date(payload.ts) : new Date();
  const hourBucket = new Date(ts);
  hourBucket.setMinutes(0, 0, 0);

  return {
    vehicleId,
    hourBucket: hourBucket.toISOString(),
    reading: { ts: ts.toISOString(), lat, lng, speed, heading },
  };
}