import { useFleetTelemetry } from './hooks/useFleetTelemetry';
import { FleetMapCanvas } from './components/FleetMapCanvas';
import { DashboardHeader } from './components/DashboardHeader';
import { AlertBanner } from './components/AlertBanner';
import type { GeofenceZone } from './types/Fleet';

const SAMPLE_GEOFENCE: GeofenceZone = {
  id: 'geo-1',
  name: 'Restricted Bay Zone',
  minLat: 37.74,
  maxLat: 37.78,
  minLng: -122.46,
  maxLng: -122.40,
};

export function App() {
  const { telemetryBufferRef, activeCount, alerts } = useFleetTelemetry(SAMPLE_GEOFENCE);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f172a',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <DashboardHeader isConnected={true} activeCount={activeCount} />

      <div style={{ position: 'relative', flex: 1, width: '100%' }}>
        <AlertBanner alerts={alerts} />
        <FleetMapCanvas telemetryBufferRef={telemetryBufferRef} geofence={SAMPLE_GEOFENCE} />
      </div>
    </div>
  );
}

export default App;