import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vehicle, GeofenceZone } from '../types/Fleet';

interface WorldMapViewProps {
  telemetryBufferRef: React.MutableRefObject<Map<string, Vehicle>>;
  geofence: GeofenceZone;
}

interface MarkerRecord {
  marker: L.CircleMarker;
  vehicle: Vehicle;
}

// Fleet area bounds (SF Bay) — used to center the initial view
const MAP_CENTER: [number, number] = [37.76, -122.44];
const MAP_ZOOM = 12;

const STATUS_COLORS: Record<Vehicle['status'], string> = {
  active: '#38bdf8',
  warning: '#f59e0b',
  idle: '#34d399',
};

export const WorldMapView: React.FC<WorldMapViewProps> = ({ telemetryBufferRef, geofence }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, MarkerRecord>>(new Map());
  const geofenceRectRef = useRef<L.Rectangle | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Initialize Leaflet map ---
    const map = L.map(container, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    // -------------- Tile layer-----------------
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Geofence rectangle overlay ---
    const bounds: L.LatLngBoundsExpression = [
      [geofence.minLat, geofence.minLng],
      [geofence.maxLat, geofence.maxLng],
    ];
    const rect = L.rectangle(bounds, {
      color: '#ef4444',
      weight: 2,
      dashArray: '8 6',
      fillColor: '#ef4444',
      fillOpacity: 0.08,
    }).addTo(map);
    rect.bindTooltip(`ZONE: ${geofence.name.toUpperCase()}`, { sticky: true });
    geofenceRectRef.current = rect;

    // Sync vehicles to markers on an interval ---
    const syncMarkers = () => {
      const buffer = telemetryBufferRef.current;
      const markers = markersRef.current;

      // Update existing + add new markers
      buffer.forEach((vehicle) => {
        let record = markers.get(vehicle.id);
        if (!record) {
          const marker = L.circleMarker([vehicle.lat, vehicle.lng], {
            radius: 4,
            color: STATUS_COLORS[vehicle.status] || '#38bdf8',
            weight: 1.5,
            fillColor: STATUS_COLORS[vehicle.status] || '#38bdf8',
            fillOpacity: 0.9,
          }).addTo(map);
          marker.bindTooltip(`${vehicle.id} — ${vehicle.speed} km/h`, { sticky: true });
          record = { marker, vehicle };
          markers.set(vehicle.id, record);
        }

        // Update position + color if changed
        record.marker.setLatLng([vehicle.lat, vehicle.lng]);
        const color = STATUS_COLORS[vehicle.status] || '#38bdf8';
        if (record.marker.options.color !== color) {
          record.marker.setStyle({ color, fillColor: color });
        }
        record.vehicle = vehicle;
      });

      // Remove markers for vehicles no longer in buffer
      markers.forEach((record, id) => {
        if (!buffer.has(id)) {
          map.removeLayer(record.marker);
          markers.delete(id);
        }
      });
    };

    intervalRef.current = setInterval(syncMarkers, 50);

    // Initial sync
    syncMarkers();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      geofenceRectRef.current = null;
    };
  }, [telemetryBufferRef, geofence]);

  return (
    <div style={styles.container}>
      <div ref={containerRef} style={styles.map} />
      {/* Legend overlay */}
      <div style={styles.legend}>
        <div style={styles.legendTitle}>LIVE VEHICLES</div>
        <div style={styles.legendRow}>
          <span style={{ ...styles.dot, backgroundColor: '#38bdf8' }} /> Active
        </div>
        <div style={styles.legendRow}>
          <span style={{ ...styles.dot, backgroundColor: '#34d399' }} /> Idle
        </div>
        <div style={styles.legendRow}>
          <span style={{ ...styles.dot, backgroundColor: '#f59e0b' }} /> Warning
        </div>
        <div style={styles.legendRow}>
          <span style={{ ...styles.dot, backgroundColor: '#ef4444' }} /> Geofence Zone
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0b0f19',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    zIndex: 1000,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(56, 189, 248, 0.15)',
    borderRadius: '8px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    pointerEvents: 'none',
  },
  legendTitle: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.8px',
    marginBottom: '2px',
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: 500,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
  },
};
