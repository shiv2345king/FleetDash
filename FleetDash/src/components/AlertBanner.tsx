import React from 'react';
import type{ GeofenceAlert } from '../types/Fleet';

interface AlertBannerProps {
  alerts: GeofenceAlert[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <aside style={styles.container}>
      <div style={styles.header}>
        <span style={styles.pulseDot} />
        <h3 style={styles.title}>GEOFENCE BREACH ALERTS</h3>
      </div>
      <div style={styles.list}>
        {alerts.map((alert) => (
          <div key={alert.id} style={styles.alertCard}>
            <div style={styles.cardTop}>
              <span style={styles.vehicleId}>{alert.vehicleId}</span>
              <span style={styles.time}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
            <div style={styles.cardBody}>
              Breached <strong style={styles.zoneName}>{alert.zoneName}</strong>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

const styles = {
  container: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    width: '300px',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '8px',
    padding: '12px',
    color: '#ffffff',
    backdropFilter: 'blur(12px)',
    zIndex: 30,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    pointerEvents: 'none' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    boxShadow: '0 0 8px #ef4444',
  },
  title: {
    margin: 0,
    fontSize: '11px',
    fontWeight: 700,
    color: '#f87171',
    letterSpacing: '0.5px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    maxHeight: '560px',
    overflowY: 'hidden' as const,
  },
  alertCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '20px',
    padding: '8px 10px',
    borderLeft: '3px solid #4488ef',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  vehicleId: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#f8fafc',
  },
  time: {
    fontSize: '10px',
    color: '#94a3b8',
    fontVariantNumeric: 'tabular-nums',
  },
  cardBody: {
    fontSize: '11px',
    color: '#cbd5e1',
  },
  zoneName: {
    color: '#f59e0b',
  },
};