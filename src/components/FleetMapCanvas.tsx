// components/FleetMapCanvas.tsx
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Vehicle, GeofenceZone } from '../types/Fleet';
import { LeafletFleetEngine } from '../engines/LeafletFleetEngine';

interface FleetMapCanvasProps {
  telemetryBufferRef: React.MutableRefObject<Map<string, Vehicle>>;
  geofence: GeofenceZone;
}

export const FleetMapCanvas: React.FC<FleetMapCanvasProps> = ({ telemetryBufferRef, geofence }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<LeafletFleetEngine | null>(null);

  // Create the map once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = new LeafletFleetEngine(container, telemetryBufferRef, geofence);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telemetryBufferRef]); // deliberately excludes geofence — handled below

  // Update geofence overlay without recreating the whole map
  useEffect(() => {
    engineRef.current?.updateGeofence(geofence);
  }, [geofence]);

  return <div ref={containerRef} style={styles.container} />;
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    backgroundColor: '#0b0f19',
    zIndex: 1, // keep the whole map below AlertBanner (zIndex 30) and Sidebar (zIndex 40)
  },
};