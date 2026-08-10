export interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  status: 'active' | 'warning' | 'critical' | 'idle';
  lastUpdated: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface GeofenceAlert {
  id: string;
  vehicleId: string;
  zoneName: string;
  timestamp: number;
}

export interface TelemetryPayload {
  vehicles: Vehicle[];
  alerts?: GeofenceAlert[];
}