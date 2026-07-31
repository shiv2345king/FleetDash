// App.tsx
import { useState, useEffect } from 'react';
import { useFleetTelemetry } from './hooks/useFleetTelemetry';
import { FleetMapCanvas } from './components/FleetMapCanvas';
import { DashboardHeader } from './components/DashboardHeader';
import { AlertBanner } from './components/AlertBanner';
import { StatsBar } from './components/StatsBar';
import { Sidebar } from './components/Sidebar';
import { OverviewPanel } from './components/OverviewPanel';
import { GeofencePanel } from './components/GeofencePanel';
import { AuthPage } from './components/AuthPage';
import type { ViewType } from './components/Sidebar';
import type { GeofenceZone, Vehicle } from './types/Fleet';

const SAMPLE_GEOFENCE: GeofenceZone = {
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
  const { telemetryBufferRef, activeCount, alerts } = useFleetTelemetry(SAMPLE_GEOFENCE);

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

  // Show nothing while checking auth (prevents flash)
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

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Dashboard (authenticated)
  const renderMainContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <OverviewPanel
            activeCount={activeCount}
            alertCount={alerts.length}
            isConnected={true}
            telemetryBufferRef={telemetryBufferRef as React.MutableRefObject<Map<string, Vehicle>>}
            geofence={SAMPLE_GEOFENCE}
          />
        );
      case 'livemap':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <AlertBanner alerts={alerts} />
            <FleetMapCanvas telemetryBufferRef={telemetryBufferRef} geofence={SAMPLE_GEOFENCE} />
          </div>
        );
      case 'geofence':
        return (
          <GeofencePanel
            geofence={SAMPLE_GEOFENCE}
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
      <DashboardHeader isConnected={true} activeCount={activeCount} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isConnected={true}
          alertCount={alerts.length}
          activeCount={activeCount}
          onLogout={handleLogout}
        />

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {renderMainContent()}
        </div>
</div>

      <StatsBar activeCount={activeCount} isConnected={true} />
    </div>
  );
}

export default App;