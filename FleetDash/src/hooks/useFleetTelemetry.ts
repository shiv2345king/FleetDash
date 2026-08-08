
import { useEffect, useRef, useState } from 'react';
import type { Vehicle, GeofenceAlert, GeofenceZone } from '../types/Fleet';

const TOTAL_VEHICLES = 1250;
const MIN_LAT = 37.70, MAX_LAT = 37.82;
const MIN_LNG = -122.52, MAX_LNG = -122.35;

export function useFleetTelemetry(geofence: GeofenceZone) {
  const telemetryBufferRef = useRef<Map<string, Vehicle>>(new Map());
  
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);

  // Initialize raw telemetry buffer
  useEffect(() => {
    const buffer = telemetryBufferRef.current;
    for (let i = 0; i < TOTAL_VEHICLES; i++) {
      const id = `TRK-${1000 + i}`;
      buffer.set(id, {
        id,
        lat: MIN_LAT + Math.random() * (MAX_LAT - MIN_LAT),
        lng: MIN_LNG + Math.random() * (MAX_LNG - MIN_LNG),
        speed: Math.floor(Math.random() * 60) + 10,
        status: Math.random() > 0.15 ? 'active' : 'warning',
        lastUpdated: Date.now(),
      });
    }
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const buffer = telemetryBufferRef.current;
      const now = Date.now();
      const newAlerts: GeofenceAlert[] = [];

      buffer.forEach((vehicle) => {
        const newLat = Math.min(MAX_LAT, Math.max(MIN_LAT, vehicle.lat + (Math.random() - 0.5) * 0.0008));
        const newLng = Math.min(MAX_LNG, Math.max(MIN_LNG, vehicle.lng + (Math.random() - 0.5) * 0.0008));

        const isInside =
          newLat >= geofence.minLat && newLat <= geofence.maxLat &&
          newLng >= geofence.minLng && newLng <= geofence.maxLng;

        if (isInside && Math.random() < 0.0001) {
          newAlerts.push({
            id: `ALT-${now}-${vehicle.id}`,
            vehicleId: vehicle.id,
            zoneName: geofence.name,
            timestamp: now,
          });
        }

        vehicle.lat = newLat;
        vehicle.lng = newLng;
        vehicle.lastUpdated = now;
      });

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 8));
      }
    }, 16);

    return () => clearInterval(updateInterval);
  }, [geofence]);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      setActiveCount(telemetryBufferRef.current.size);
    }, 1000);

    return () => clearInterval(syncInterval);
  }, []);

  return {
    telemetryBufferRef,
    activeCount,
    alerts,
  };
}