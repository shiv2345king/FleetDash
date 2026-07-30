import React, { useEffect, useRef } from 'react';
import type { GeofenceAlert } from '../types/Fleet';

interface AlertBannerProps {
  alerts: GeofenceAlert[];
}

const getSeverityColor = (alert: GeofenceAlert): string => {
  // Simulate severity based on zone name or id hash
  const hash = alert.zoneName.length + alert.vehicleId.charCodeAt(alert.vehicleId.length - 1);
  if (hash % 3 === 0) return '#ef4444'; // critical - red
  if (hash % 3 === 1) return '#f59e0b'; // warning - amber
  return '#3b82f6'; // info - blue
};

const getSeverityLabel = (color: string): string => {
  if (color === '#ef4444') return 'CRITICAL';
  if (color === '#f59e0b') return 'WARNING';
  return 'INFO';
};

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef(alerts.length);

  // Auto-scroll to top when new alerts come in
  useEffect(() => {
    if (alerts.length > prevCountRef.current && listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevCountRef.current = alerts.length;
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  return (
    <aside style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.pulseDot} />
          <h3 style={styles.title}>GEOFENCE BREACHES</h3>
        </div>
        <span style={styles.badge}>{alerts.length}</span>
      </div>
      <div ref={listRef} style={styles.list}>
        {alerts.map((alert, index) => {
          const severityColor = getSeverityColor(alert);
          return (
            <div
              key={alert.id}
              style={{
                ...styles.alertCard,
                animation: `slide-in-right 0.3s ease-out ${index * 0.05}s both`,
                borderLeftColor: severityColor,
              }}
            >
              <div style={styles.cardTop}>
                <div style={styles.cardTopLeft}>
                  <span style={styles.vehicleBadge}>{alert.vehicleId}</span>
                  <span style={{ ...styles.severityLabel, color: severityColor }}>
                    {getSeverityLabel(severityColor)}
                  </span>
                </div>
                <span style={styles.time}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <div style={styles.cardBody}>
                Breached <strong style={styles.zoneName}>{alert.zoneName}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

const styles = {
  container: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    width: '320px',
    maxHeight: 'calc(100vh - 100px)',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '10px',
    padding: '12px',
    color: '#ffffff',
    backdropFilter: 'blur(16px) saturate(150%)',
    WebkitBackdropFilter: 'blur(16px) saturate(150%)',
    zIndex: 30,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    pointerEvents: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '10px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  pulseDot: {
    width: '7px',
    height: '7px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    boxShadow: '0 0 8px #ef4444',
    animation: 'pulse-dot 1.5s ease-in-out infinite',
  },
  title: {
    margin: 0,
    fontSize: '10px',
    fontWeight: 700,
    color: '#f87171',
    letterSpacing: '0.8px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '500px',
    overflowY: 'auto' as const,
    paddingRight: '2px',
  },
  alertCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '8px',
    padding: '10px 12px',
    borderLeft: '3px solid #ef4444',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  cardTopLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  vehicleBadge: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#f8fafc',
    backgroundColor: 'rgba(71, 85, 105, 0.5)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  severityLabel: {
    fontSize: '8px',
    fontWeight: 800,
    letterSpacing: '0.5px',
  },
  time: {
    fontSize: '10px',
    color: '#64748b',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  cardBody: {
    fontSize: '11px',
    color: '#cbd5e1',
  },
  zoneName: {
    color: '#f59e0b',
    fontWeight: 700,
  },
};
