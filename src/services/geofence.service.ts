import * as turf from "@turf/turf";
import { Geofence } from "../model/geofenc.model";
import { Alert } from "../model/alert.model";
import { redisPublisher } from "../config/redis";

const ALERT_CHANNEL = "telemetry:alerts";

// Cache active geofences in memory, refreshed periodically, to avoid a DB hit on every single reading
let geofenceCache: any[] = [];
let lastCacheRefresh = 0;
const CACHE_TTL_MS = 30_000;

async function getActiveGeofences() {
  const now = Date.now();
  if (now - lastCacheRefresh > CACHE_TTL_MS) {
    geofenceCache = await Geofence.find({ active: true }).lean();
    lastCacheRefresh = now;
  }
  return geofenceCache;
}

export async function checkGeofenceBreach(vehicleId: string, lat: number, lng: number) {
  const zones = await getActiveGeofences();
  const point = turf.point([lng, lat]);

  for (const zone of zones) {
    if (zone.vehicleId && zone.vehicleId !== vehicleId) continue;

    const polygon = turf.polygon(zone.polygon.coordinates);
    const isInside = turf.booleanPointInPolygon(point, polygon);

    if (isInside) {
      const alert = await Alert.create({
        vehicleId,
        geofenceId: zone._id,
        geofenceName: zone.name,
        lat,
        lng,
      });

      redisPublisher.publish(
        ALERT_CHANNEL,
        JSON.stringify({
          vehicleId,
          geofenceName: zone.name,
          lat,
          lng,
          triggeredAt: alert.triggeredAt,
        })
      );
    }
  }
}