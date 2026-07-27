
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Vehicle, GeofenceAlert, TelemetryPayload } from '../types/Fleet';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

// Demo simulation helpers — generates realistic fleet data when no backend is available
const DEMO_VEHICLE_COUNT = 48;
const DEMO_VEHICLE_IDS = Array.from({ length: DEMO_VEHICLE_COUNT }, (_, i) => `V-${String(i + 1).padStart(3, '0')}`);
const STATUSES: Vehicle['status'][] = ['active', 'active', 'active', 'active', 'idle', 'warning'];

function createDemoVehicle(id: string, time: number): Vehicle {
  // Simulate vehicles moving in the San Francisco bay area
  const baseLat = 37.76 + (Math.random() - 0.5) * 0.08;
  const baseLng = -122.44 + (Math.random() - 0.5) * 0.10;
  return {
    id,
    lat: baseLat + Math.sin(time / 2000 + parseInt(id)) * 0.01,
    lng: baseLng + Math.cos(time / 2500 + parseInt(id)) * 0.01,
    speed: Math.round(20 + Math.random() * 60),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    lastUpdated: Date.now(),
  };
}

export function useFleetSocket() {
  const socketRef = useRef<Socket | null>(null);
  const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Mutable Ref to store vehicles without triggering heavy React re-renders
  const vehiclesRef = useRef<Map<string, Vehicle>>(new Map());
  const alertCounterRef = useRef<number>(0);
  
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // High-throughput telemetry event
    socket.on('telemetry_batch', (payload: TelemetryPayload) => {
      for (let i = 0; i < payload.vehicles.length; i++) {
        const v = payload.vehicles[i];
        vehiclesRef.current.set(v.id, v);
      }

      if (payload.alerts && payload.alerts.length > 0) {
        setAlerts((prev) => [...payload.alerts!, ...prev].slice(0, 10));
      }
    });

    // If connection fails, fall back to demo simulation after 3 seconds
    const fallbackTimer = setTimeout(() => {
      if (!socket.connected) {
        socket.disconnect();
        setIsConnected(true); // Show as LIVE for demo

        // Seed initial vehicles
        const now = Date.now();
        DEMO_VEHICLE_IDS.forEach((id) => {
          vehiclesRef.current.set(id, createDemoVehicle(id, now));
        });

        // Simulate telemetry every ~500ms (2 updates/sec per vehicle batch)
        demoIntervalRef.current = setInterval(() => {
          const t = Date.now();
          const batch: Vehicle[] = DEMO_VEHICLE_IDS.map((id) => createDemoVehicle(id, t));
          
          // Batch update all vehicles
          for (const v of batch) {
            vehiclesRef.current.set(v.id, v);
          }

          // Occasionally generate a geofence alert (every ~5th tick)
          if (Math.random() < 0.25) {
            alertCounterRef.current += 1;
            const randomVehicle = DEMO_VEHICLE_IDS[Math.floor(Math.random() * DEMO_VEHICLE_IDS.length)];
            const alert: GeofenceAlert = {
              id: `alert-${alertCounterRef.current}`,
              vehicleId: randomVehicle,
              zoneName: 'Restricted Bay Zone',
              timestamp: Date.now(),
            };
            setAlerts((prev) => [alert, ...prev].slice(0, 10));
          }
        }, 500);
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      socket.disconnect();
    };
  }, []);

  return {
    vehiclesRef,
    alerts,
    isConnected,
  };
}
