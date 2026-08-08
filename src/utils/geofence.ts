import type { GeofenceZone } from '../types/Fleet';

interface BackendGeofence {
  _id: string;
  name: string;
  polygon: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  active: boolean;
}

export function toGeofenceZone(g: BackendGeofence): GeofenceZone {
  const ring = g.polygon.coordinates[0];
  const lats = ring.map(([, lat]) => lat);
  const lngs = ring.map(([lng]) => lng);

  return {
    id: g._id,
    name: g.name,
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}