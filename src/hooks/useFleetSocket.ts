// hooks/useFleetSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Vehicle, GeofenceAlert, GeofenceZone } from '../types/Fleet';
import { API_ROUTES, SOCKET_URL, apiFetch } from '../config/api';

interface BackendReading {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ts: number | string;
}

interface BackendAlert {
  _id?: string;
  vehicleId: string;
  geofenceName: string;
  triggeredAt?: string;
}

// Buffer zone around the geofence boundary, as a fraction of the zone's span,
// used to flag vehicles approaching the zone before they actually enter it.
const APPROACH_BUFFER_RATIO = 0.15;

function computeStatus(lat: number, lng: number, geofence: GeofenceZone): 'active' | 'warning' | 'critical' {
  const insideZone =
    lat >= geofence.minLat && lat <= geofence.maxLat &&
    lng >= geofence.minLng && lng <= geofence.maxLng;

  if (insideZone) return 'critical'; // entered the restricted zone — red

  const latBuffer = (geofence.maxLat - geofence.minLat) * APPROACH_BUFFER_RATIO;
  const lngBuffer = (geofence.maxLng - geofence.minLng) * APPROACH_BUFFER_RATIO;

  const insideBufferZone =
    lat >= geofence.minLat - latBuffer && lat <= geofence.maxLat + latBuffer &&
    lng >= geofence.minLng - lngBuffer && lng <= geofence.maxLng + lngBuffer;

  if (insideBufferZone) return 'warning'; // approaching the zone — yellow

  return 'active'; // safely outside — green
}

function toVehicle(r: BackendReading, geofence: GeofenceZone): Vehicle {
  return {
    id: r.vehicleId,
    lat: r.lat,
    lng: r.lng,
    speed: r.speed,
    status: computeStatus(r.lat, r.lng, geofence),
    lastUpdated: typeof r.ts === 'number' ? r.ts : new Date(r.ts).getTime(),
  };
}

function toGeofenceAlert(a: BackendAlert): GeofenceAlert {
  return {
    id: a._id ?? `alert-${Date.now()}-${Math.random()}`,
    vehicleId: a.vehicleId,
    zoneName: a.geofenceName,
    timestamp: a.triggeredAt ? new Date(a.triggeredAt).getTime() : Date.now(),
  };
}

export function useFleetSocket(geofence: GeofenceZone) {
  const socketRef = useRef<Socket | null>(null);
  const vehiclesRef = useRef<Map<string, Vehicle>>(new Map());
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    apiFetch<BackendReading[]>(API_ROUTES.vehicles.latest)
      .then((data) => {
        data.forEach((r) => vehiclesRef.current.set(r.vehicleId, toVehicle(r, geofence)));
        setActiveCount(vehiclesRef.current.size);
      })
      .catch((err) => console.error('Failed to load initial vehicle positions:', err));
  }, [geofence]);

  useEffect(() => {
    apiFetch<BackendAlert[]>(API_ROUTES.geofence.alerts)
      .then((data) => setAlerts(data.map(toGeofenceAlert).slice(0, 10)))
      .catch((err) => console.error('Failed to load historical alerts:', err));
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true });
    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('telemetry:update', (payload: BackendReading) => {
      vehiclesRef.current.set(payload.vehicleId, toVehicle(payload, geofence));
      setActiveCount(vehiclesRef.current.size);
    });

    socket.on('telemetry:alert', (payload: BackendAlert) => {
      setAlerts((prev) => [toGeofenceAlert(payload), ...prev].slice(0, 10));
    });

    return () => {
      socket.disconnect();
    };
  }, [geofence]);

  return { vehiclesRef, alerts, isConnected, activeCount };
}