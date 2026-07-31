import type { Vehicle, GeofenceZone } from '../types/Fleet';

export class CanvasFleetEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private bufferRef: React.MutableRefObject<Map<string, Vehicle>>;
  private geofence: GeofenceZone;

  private readonly MIN_LAT = 37.70;
  private readonly MAX_LAT = 37.82;
  private readonly MIN_LNG = -122.52;
  private readonly MAX_LNG = -122.35;

  // HUD performance tracking
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private fps = 0;
  private scanLineOffset = 0;

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
  }

  public start() {
    if (this.animationFrameId !== null) return;

    const render = (timestamp: number) => {
      this.drawFrame(timestamp);
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
    const x = ((lng - this.MIN_LNG) / (this.MAX_LNG - this.MIN_LNG)) * width;
    const y = height - ((lat - this.MIN_LAT) / (this.MAX_LAT - this.MIN_LAT)) * height;
    return { x, y };
  }

  private getSpeedColor(speed: number): { fill: string; glow: string } {
    if (speed < 20) {
      return { fill: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)' };
    } else if (speed < 40) {
      return { fill: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' };
    } else if (speed < 60) {
      return { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' };
    } else {
      return { fill: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' };
    }
  }

  private drawFrame(timestamp: number) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const ctx = this.ctx;

    // --- FPS calculation ---
    this.frameCount++;
    if (timestamp - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = timestamp;
    }

    // Update scan line position
    this.scanLineOffset = (this.scanLineOffset + 0.8) % height;

    // --- Background ---
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, width, height);

    // --- Grid ---
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
    ctx.lineWidth = 1;
    const gridSize = 60;

    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // --- Scan line effect ---
    ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.fillRect(0, this.scanLineOffset, width, 4);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.fillRect(0, this.scanLineOffset, width, 1);

    // --- Geofence Zone ---
    const geoTopLeft = this.latLngToPixel(this.geofence.maxLat, this.geofence.minLng, width, height);
    const geoBottomRight = this.latLngToPixel(this.geofence.minLat, this.geofence.maxLng, width, height);
    const geoWidth = geoBottomRight.x - geoTopLeft.x;
    const geoHeight = geoBottomRight.y - geoTopLeft.y;

    // Geofence fill
    ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
    ctx.fillRect(geoTopLeft.x, geoTopLeft.y, geoWidth, geoHeight);

    // Hatch pattern
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.lineWidth = 0.5;
    const hatchSpacing = 20;
    ctx.beginPath();
    for (let i = -geoHeight; i < geoWidth + geoHeight; i += hatchSpacing) {
      const startX = geoTopLeft.x + i;
      const startY = geoTopLeft.y;
      const endX = geoTopLeft.x + i - geoHeight;
      const endY = geoTopLeft.y + geoHeight;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();

    // Dashed geofence border
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(geoTopLeft.x, geoTopLeft.y, geoWidth, geoHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Geofence Label
    ctx.fillStyle = '#f87171';
    ctx.font = '600 11px system-ui, -apple-system, sans-serif';
    ctx.fillText(`ZONE: ${this.geofence.name.toUpperCase()}`, geoTopLeft.x + 8, geoTopLeft.y + 18);

    // Corner markers
    const cornerSize = 8;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 1.5;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(geoTopLeft.x, geoTopLeft.y + cornerSize);
    ctx.lineTo(geoTopLeft.x, geoTopLeft.y);
    ctx.lineTo(geoTopLeft.x + cornerSize, geoTopLeft.y);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(geoTopLeft.x + geoWidth - cornerSize, geoTopLeft.y);
    ctx.lineTo(geoTopLeft.x + geoWidth, geoTopLeft.y);
    ctx.lineTo(geoTopLeft.x + geoWidth, geoTopLeft.y + cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(geoTopLeft.x, geoTopLeft.y + geoHeight - cornerSize);
    ctx.lineTo(geoTopLeft.x, geoTopLeft.y + geoHeight);
    ctx.lineTo(geoTopLeft.x + cornerSize, geoTopLeft.y + geoHeight);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(geoTopLeft.x + geoWidth - cornerSize, geoTopLeft.y + geoHeight);
    ctx.lineTo(geoTopLeft.x + geoWidth, geoTopLeft.y + geoHeight);
    ctx.lineTo(geoTopLeft.x + geoWidth, geoTopLeft.y + geoHeight - cornerSize);
    ctx.stroke();

    // --- Vehicles ---
    const buffer = this.bufferRef.current;
    const vehicleCount = buffer.size;

    // First pass: draw glows
    buffer.forEach((vehicle) => {
      const point = this.latLngToPixel(vehicle.lat, vehicle.lng, width, height);
      const size = vehicle.status === 'warning' ? 3.5 : 2.5;
      const colors = this.getSpeedColor(vehicle.speed);

      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 6);
      if (vehicle.status === 'warning') {
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      } else {
        gradient.addColorStop(0, colors.glow.replace('0.6', '0.25'));
      }
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size * 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Second pass: draw vehicle bodies
    buffer.forEach((vehicle) => {
      const point = this.latLngToPixel(vehicle.lat, vehicle.lng, width, height);
      const size = vehicle.status === 'warning' ? 3.5 : 2.5;
      const colors = this.getSpeedColor(vehicle.speed);

      ctx.fillStyle = vehicle.status === 'warning' ? '#f59e0b' : colors.fill;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = vehicle.status === 'warning' ? '#fde68a' : '#ffffff';
      ctx.beginPath();
      ctx.arc(point.x, point.y, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- HUD Overlay (bottom-left) ---
    const hudY = height - 80;
    const hudX = 16;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.beginPath();
    ctx.roundRect(hudX - 8, hudY - 8, 200, 72, 6);
    ctx.fill();

    // FPS
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 22px "SF Mono", "Fira Code", monospace';
    ctx.fillText(`${this.fps}`, hudX, hudY + 22);
    ctx.fillStyle = '#64748b';
    ctx.font = '500 9px system-ui, -apple-system, sans-serif';
    ctx.fillText('FPS', hudX + 50, hudY + 20);

    // Vehicles
    ctx.fillStyle = '#10b981';
    ctx.font = '700 22px "SF Mono", "Fira Code", monospace';
    ctx.fillText(`${vehicleCount}`, hudX + 100, hudY + 22);
    ctx.fillStyle = '#64748b';
    ctx.font = '500 9px system-ui, -apple-system, sans-serif';
    ctx.fillText('VEHICLES', hudX + 150, hudY + 20);

    // Bottom row
    ctx.fillStyle = '#64748b';
    ctx.font = '500 9px system-ui, -apple-system, sans-serif';
    ctx.fillText('HIGH-THROUGHPUT EVENT-DRIVEN TELEMETRY ENGINE', hudX, hudY + 48);

    // --- Top-right system info --- //
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.beginPath();
    ctx.roundRect(width - 170, 16, 154, 24, 6);
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.font = '700 9px "SF Mono", "Fira Code", monospace';
    ctx.fillText('\u25CF  SYSTEM OPERATIONAL', width - 162, 32);

    // Performance bar
    const barWidth = width - 40;
    const barHeight = 2;
    const barY = height - 6;
    const utilization = Math.min(1, vehicleCount / 2000);

    ctx.fillStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.beginPath();
    ctx.roundRect(20, barY, barWidth, barHeight, 2);
    ctx.fill();

    const gradient = ctx.createLinearGradient(20, barY, 20 + barWidth * utilization, barY);
    gradient.addColorStop(0, '#38bdf8');
    gradient.addColorStop(0.5, '#818cf8');
    gradient.addColorStop(1, '#34d399');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(20, barY, barWidth * utilization, barHeight, 2);
    ctx.fill();
  }
}
