
import { useState, useEffect } from 'react';
import { useFleetSocket } from './hooks/useFleetSocket';
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
  const { vehiclesRef, alerts, isConnected } = useFleetSocket();
  const [vehicleCount, setVehicleCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleCount(vehiclesRef.current.size);
    }, 1000);
    return () => clearInterval(interval);
  }, [vehiclesRef]);

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
      <DashboardHeader isConnected={isConnected} activeCount={vehicleCount} />
      
      <div style={{ position: 'relative', flex: 1, width: '100%' }}>
        <AlertBanner alerts={alerts} />
        <FleetMapCanvas vehiclesRef={vehiclesRef} geofence={SAMPLE_GEOFENCE} />
      </div>
    </div>
  );
}

export default App;