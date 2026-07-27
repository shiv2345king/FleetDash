import { useRef, useEffect, type MutableRefObject } from 'react';
import type { Vehicle, GeofenceZone } from '../types/Fleet';

interface FleetMapCanvasProps {
  vehiclesRef: MutableRefObject<Map<string, Vehicle>>;
  geofence: GeofenceZone;
}

// Bounding box mapping utilities for coordinates -> canvas pixels
function latLngToPixel(lat: number, lng: number, width: number, height: number) {
  // Demo coordinates bounds (e.g., city bounding box)
  const MIN_LAT = 37.70;
  const MAX_LAT = 37.82;
  const MIN_LNG = -122.52;
  const MAX_LNG = -122.35;

  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * width;
  const y = height - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * height;

  return { x, y };
}

export const FleetMapCanvas = ({ vehiclesRef, geofence }: FleetMapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear Frame
      ctx.fillStyle = '#0f172a'; // Slate dark background
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Geofence Zone
      const geoTopLeft = latLngToPixel(geofence.maxLat, geofence.minLng, width, height);
      const geoBottomRight = latLngToPixel(geofence.minLat, geofence.maxLng, width, height);

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(
        geoTopLeft.x,
        geoTopLeft.y,
        geoBottomRight.x - geoTopLeft.x,
        geoBottomRight.y - geoTopLeft.y
      );
      ctx.fill();
      ctx.stroke();

      // Label Geofence
      ctx.fillStyle = '#ef4444';
      ctx.font = '12px sans-serif';
      ctx.fillText(`ZONE: ${geofence.name}`, geoTopLeft.x + 8, geoTopLeft.y + 20);

      // 3. Batch Render High-Volume Vehicles
      const vehicles = vehiclesRef.current;
      
      vehicles.forEach((vehicle) => {
        const { x, y } = latLngToPixel(vehicle.lat, vehicle.lng, width, height);

        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI);

        if (vehicle.status === 'warning') {
          ctx.fillStyle = '#f59e0b'; // Amber
        } else if (vehicle.status === 'active') {
          ctx.fillStyle = '#10b981'; // Emerald
        } else {
          ctx.fillStyle = '#6b7280'; // Gray
        }

        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [vehiclesRef, geofence]);

return (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'cover',
      }}
    />
  </div>
);
};