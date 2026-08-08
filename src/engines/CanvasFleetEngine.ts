// engines/CanvasFleetEngine.ts
import type { Vehicle, GeofenceZone } from '../types/Fleet';

export class CanvasFleetEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private bufferRef: React.MutableRefObject<Map<string, Vehicle>>;
  private geofence: GeofenceZone;

  private minLat: number = 0;
  private maxLat: number = 0;
  private minLng: number = 0;
  private maxLng: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    bufferRef: React.MutableRefObject<Map<string, Vehicle>>,
    geofence: GeofenceZone
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not acquire Canvas 2D Context');
    this.ctx = context;
    this.bufferRef = bufferRef;
    this.geofence = geofence;
    this.computeBounds();
  }

  // Derive drawing bounds from the actual geofence, padded so vehicles
  // near/outside the zone are still visible instead of hardcoding a fixed region.
  private computeBounds() {
    const latSpan = this.geofence.maxLat - this.geofence.minLat;
    const lngSpan = this.geofence.maxLng - this.geofence.minLng;
    const latPad = latSpan * 0.6 || 0.02;
    const lngPad = lngSpan * 0.6 || 0.02;

    this.minLat = this.geofence.minLat - latPad;
    this.maxLat = this.geofence.maxLat + latPad;
    this.minLng = this.geofence.minLng - lngPad;
    this.maxLng = this.geofence.maxLng + lngPad;
  }

  // Call if the geofence changes without recreating the engine
  public updateGeofence(geofence: GeofenceZone) {
    this.geofence = geofence;
    this.computeBounds();
  }

  public start() {
    if (this.animationFrameId !== null) return;

    const render = () => {
      this.drawFrame();
      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private latLngToPixel(lat: number, lng: number, width: number, height: number) {
    const x = ((lng - this.minLng) / (this.maxLng - this.minLng)) * width;
    const y = height - ((lat - this.minLat) / (this.maxLat - this.minLat)) * height;
    return { x, y };
  }

  private drawFrame() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.ctx.fillStyle = '#0b0f19';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
    this.ctx.lineWidth = 1;
    const gridSize = 60;

    this.ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }
    this.ctx.stroke();

    const geoTopLeft = this.latLngToPixel(this.geofence.maxLat, this.geofence.minLng, width, height);
    const geoBottomRight = this.latLngToPixel(this.geofence.minLat, this.geofence.maxLng, width, height);
    const geoWidth = geoBottomRight.x - geoTopLeft.x;
    const geoHeight = geoBottomRight.y - geoTopLeft.y;

    this.ctx.strokeStyle = '#ef4444';
    this.ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.rect(geoTopLeft.x, geoTopLeft.y, geoWidth, geoHeight);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#f87171';
    this.ctx.font = '600 11px system-ui, -apple-system, sans-serif';
    this.ctx.fillText(`ZONE: ${this.geofence.name.toUpperCase()}`, geoTopLeft.x + 8, geoTopLeft.y + 18);

    const buffer = this.bufferRef.current;

    const activePaths: Array<{ x: number; y: number }> = [];
    const warningPaths: Array<{ x: number; y: number }> = [];

    buffer.forEach((vehicle) => {
      const point = this.latLngToPixel(vehicle.lat, vehicle.lng, width, height);
      if (vehicle.status === 'active') {
        activePaths.push(point);
      } else {
        warningPaths.push(point);
      }
    });

    this.ctx.fillStyle = '#10b981';
    this.ctx.beginPath();
    for (let i = 0; i < activePaths.length; i++) {
      const p = activePaths[i];
      this.ctx.moveTo(p.x + 2.5, p.y);
      this.ctx.arc(p.x, p.y, 2.5, 0, 2 * Math.PI);
    }
    this.ctx.fill();

    this.ctx.fillStyle = '#f59e0b';
    this.ctx.beginPath();
    for (let i = 0; i < warningPaths.length; i++) {
      const p = warningPaths[i];
      this.ctx.moveTo(p.x + 3, p.y);
      this.ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
    }
    this.ctx.fill();
  }
}