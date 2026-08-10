// App.tsx
import { useState, useEffect } from 'react';
import { useFleetSocket } from './hooks/useFleetSocket';
import { FleetMapCanvas } from './components/FleetMapCanvas';
import { DashboardHeader } from './components/DashboardHeader';
import { AlertBanner } from './components/AlertBanner';
import { StatsBar } from './components/StatusBar';
import { Sidebar } from './components/Sidebar';
import { OverviewPanel } from './components/OverviewPanel';
import { GeofencePanel } from './components/GeofencePanel';
import { AuthPage } from './components/AuthPage';
import type { ViewType } from './components/Sidebar';
import { API_ROUTES, apiFetch } from './config/api';
import { toGeofenceZone } from './utils/geofence';
import type { GeofenceZone, Vehicle } from './types/Fleet';

const FALLBACK_GEOFENCE: GeofenceZone = {
  id: 'geo-1',
  name: 'Restricted Bay Zone',
  minLat: 37.74,
  maxLat: 37.78,
  minLng: -122.46,
  maxLng: -122.40,
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('livemap');
  const [geofence, setGeofence] = useState<GeofenceZone>(FALLBACK_GEOFENCE);

// App.tsx — find this line and update it
const { vehiclesRef, activeCount, alerts, isConnected } = useFleetSocket(geofence);

  // Fetch real geofence zone from backend
  useEffect(() => {
    apiFetch<any[]>(API_ROUTES.geofence.list)
      .then((zones) => {
        if (zones.length > 0) setGeofence(toGeofenceZone(zones[0]));
      })
      .catch((err) => console.error('Failed to load geofence zones:', err));
  }, []);

  // Check localStorage for existing auth session on mount
  useEffect(() => {
    const stored = localStorage.getItem('fleetDashAuth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated) {
          setIsAuthenticated(true);
        }
      } catch {
        // ignore parse errors
      }
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (_email: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('fleetDashAuth');
    setIsAuthenticated(false);
  };

  if (!authChecked) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0b0f19',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#64748b', fontSize: '14px' }}>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <OverviewPanel
            activeCount={activeCount}
            alertCount={alerts.length}
            isConnected={isConnected}
            telemetryBufferRef={vehiclesRef as React.MutableRefObject<Map<string, Vehicle>>}
            geofence={geofence}
          />
        );
      case 'livemap':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <AlertBanner alerts={alerts} />
            <FleetMapCanvas telemetryBufferRef={vehiclesRef} geofence={geofence} />
          </div>
        );
      case 'geofence':
        return (
          <GeofencePanel
            geofence={geofence}
            alerts={alerts}
            activeCount={activeCount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0b0f19',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <DashboardHeader isConnected={isConnected} activeCount={activeCount} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isConnected={isConnected}
          alertCount={alerts.length}
          activeCount={activeCount}
          onLogout={handleLogout}
        />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {renderMainContent()}
        </div>
      </div>

      <StatsBar activeCount={activeCount} isConnected={isConnected} />
    </div>
  );
}

export default App;