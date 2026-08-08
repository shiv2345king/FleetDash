// engines/LeafletFleetEngine.ts
import L from 'leaflet';
import type { Vehicle, GeofenceZone } from '../types/Fleet';

export class LeafletFleetEngine {
  private map: L.Map;
  private bufferRef: React.MutableRefObject<Map<string, Vehicle>>;
  private geofence: GeofenceZone;
  private markers: Map<string, L.CircleMarker> = new Map();
  private geofenceRect: L.Rectangle | null = null;
  private animationFrameId: number | null = null;

  constructor(
    container: HTMLDivElement,
    bufferRef: React.MutableRefObject<Map<string, Vehicle>>,
    geofence: GeofenceZone
  ) {
    this.bufferRef = bufferRef;
    this.geofence = geofence;

    const centerLat = (geofence.minLat + geofence.maxLat) / 2;
    const centerLng = (geofence.minLng + geofence.maxLng) / 2;

    this.map = L.map(container, {
      center: [centerLat, centerLng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.drawGeofence();
  }

  private drawGeofence() {
    const bounds: L.LatLngBoundsExpression = [
      [this.geofence.minLat, this.geofence.minLng],
      [this.geofence.maxLat, this.geofence.maxLng],
    ];

    this.geofenceRect = L.rectangle(bounds, {
      color: '#ef4444',
      weight: 1.5,
      fillColor: '#ef4444',
      fillOpacity: 0.12,
    }).addTo(this.map);

    this.geofenceRect.bindTooltip(`ZONE: ${this.geofence.name.toUpperCase()}`, {
      permanent: false,
      direction: 'center',
    });
  }

  public updateGeofence(geofence: GeofenceZone) {
    this.geofence = geofence;
    if (this.geofenceRect) {
      this.geofenceRect.remove();
    }
    this.drawGeofence();
  }

  public start() {
    if (this.animationFrameId !== null) return;

    const render = () => {
      this.syncMarkers();
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

  public destroy() {
    this.stop();
    this.map.remove();
  }

  private syncMarkers() {
    const buffer = this.bufferRef.current;
    const seenIds = new Set<string>();

    buffer.forEach((vehicle) => {
      seenIds.add(vehicle.id);
      const color = vehicle.status === 'critical' ? '#ef4444'   // red — inside the zone
        : vehicle.status === 'warning' ? '#f59e0b'                // yellow — approaching
        : vehicle.status === 'active' ? '#10b981'                 // green — safely outside
        : '#64748b';                                              // idle — gray

      let marker = this.markers.get(vehicle.id);
      if (!marker) {
        marker = L.circleMarker([vehicle.lat, vehicle.lng], {
          radius: 4,
          color,
          fillColor: color,
          fillOpacity: 0.9,
          weight: 1,
        }).addTo(this.map);
        marker.bindTooltip(`${vehicle.id} — ${vehicle.speed} mph`, { direction: 'top' });
        this.markers.set(vehicle.id, marker);
      } else {
        marker.setLatLng([vehicle.lat, vehicle.lng]);
        marker.setStyle({ color, fillColor: color });
      }
    });

    this.markers.forEach((marker, id) => {
      if (!seenIds.has(id)) {
        marker.remove();
        this.markers.delete(id);
      }
    });
  }
}