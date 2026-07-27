import type { GeofenceAlert } from '../types/Fleet';

interface AlertBannerProps {
  alerts: GeofenceAlert[];
}

export const AlertBanner = ({ alerts }: AlertBannerProps) => {
  if (alerts.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>⚡ Live Geofence Alerts</h3>
      <ul style={styles.list}>
        {alerts.map((alert) => (
          <li key={alert.id} style={styles.item}>
            <strong>Vehicle {alert.vehicleId}</strong> breached zone{' '}
            <span style={styles.zone}>{alert.zoneName}</span> at{' '}
            {new Date(alert.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute' as const,
    top: '96px',
    right: '24px',
    width: '320px',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    padding: '16px',
    color: '#ffffff',
    backdropFilter: 'blur(8px)',
    zIndex: 10,
  },
  heading: { margin: '0 0 12px 0', fontSize: '14px', color: '#ef4444' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { fontSize: '12px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #334155' },
  zone: { color: '#f59e0b', fontWeight: 'bold' as const },
};