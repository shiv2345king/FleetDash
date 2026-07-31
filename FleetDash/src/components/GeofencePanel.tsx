import React from 'react';
import type { GeofenceZone, GeofenceAlert } from '../types/Fleet';

interface GeofencePanelProps {
  geofence: GeofenceZone;
  alerts: GeofenceAlert[];
  activeCount: number;
}

export const GeofencePanel: React.FC<GeofencePanelProps> = ({ geofence, alerts, activeCount }) => {
  const zoneArea = (
    ((geofence.maxLat - geofence.minLat) * 111.32) *
    ((geofence.maxLng - geofence.minLng) * 111.32 * Math.cos((geofence.minLat + geofence.maxLat) / 2 * Math.PI / 180))
  ).toFixed(1);

  const vehiclesInside = Math.floor(activeCount * 0.08);
  const vehiclesOutside = activeCount - vehiclesInside;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Geofence Management</h2>
        <span style={styles.subtitle}>Restricted zone monitoring & breach detection</span>
      </div>

      {/* Geofence Zone Card */}
      <div style={styles.zoneCard}>
        <div style={styles.zoneHeader}>
          <span style={styles.zoneIcon}>⊞</span>
          <div>
            <span style={styles.zoneName}>{geofence.name}</span>
            <span style={styles.zoneId}>ID: {geofence.id}</span>
          </div>
          <span style={styles.zoneStatus}>ACTIVE</span>
        </div>

        <div style={styles.zoneGrid}>
          <div style={styles.zoneStat}>
            <span style={styles.zsLabel}>BOUNDS</span>
            <span style={styles.zsValue}>
              {geofence.minLat.toFixed(4)}°N – {geofence.maxLat.toFixed(4)}°N
            </span>
          </div>
          <div style={styles.zoneStat}>
            <span style={styles.zsLabel}>LONGITUDE</span>
            <span style={styles.zsValue}>
              {geofence.minLng.toFixed(4)}°W – {geofence.maxLng.toFixed(4)}°W
            </span>
          </div>
          <div style={styles.zoneStat}>
            <span style={styles.zsLabel}>AREA</span>
            <span style={styles.zsValue}>~{zoneArea} km²</span>
          </div>
          <div style={styles.zoneStat}>
            <span style={styles.zsLabel}>STATUS</span>
            <span style={{ ...styles.zsValue, color: '#34d399' }}>Monitoring</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🚛</span>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>VEHICLES INSIDE ZONE</span>
            <span style={styles.statValue}>{vehiclesInside}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>↗</span>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>OUTSIDE ZONE</span>
            <span style={styles.statValue}>{vehiclesOutside}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>⚠</span>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>BREACHES</span>
            <span style={{ ...styles.statValue, color: '#f87171' }}>{alerts.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Breaches */}
      <div style={styles.breachesSection}>
        <div style={styles.breachesHeader}>
          <span style={styles.breachesTitle}>RECENT BREACHES</span>
          {alerts.length > 0 && <span style={styles.breachesBadge}>{alerts.length}</span>}
        </div>
        {alerts.length === 0 ? (
          <div style={styles.noBreaches}>
            <span style={styles.noBreachesIcon}>✓</span>
            <span style={styles.noBreachesText}>No recent breaches detected</span>
          </div>
        ) : (
          <div style={styles.breachesList}>
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} style={styles.breachItem}>
                <span style={styles.breachVehicle}>{alert.vehicleId}</span>
                <span style={styles.breachTime}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
                <span style={styles.breachZone}>{alert.zoneName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zone visual representation */}
      <div style={styles.zoneVisual}>
        <div style={styles.zoneVisualHeader}>
          <span style={styles.zvTitle}>ZONE VISUALIZATION</span>
        </div>
        <div style={styles.zoneMap}>
          <div style={styles.zoneBox}>
            <span style={styles.zoneBoxLabel}>RESTRICTED BAY ZONE</span>
            <div style={styles.zoneCoords}>
              <span>NW: {geofence.maxLat.toFixed(2)}°, {geofence.minLng.toFixed(2)}°</span>
              <span>SE: {geofence.minLat.toFixed(2)}°, {geofence.maxLng.toFixed(2)}°</span>
            </div>
          </div>
          <div style={styles.zoneLegend}>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#ef4444' }} />
              <span style={styles.legendLabel}>Zone Boundary</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#f59e0b' }} />
              <span style={styles.legendLabel}>Warning Vehicles</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#10b981' }} />
              <span style={styles.legendLabel}>Active Vehicles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    padding: '20px 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#f8fafc',
    letterSpacing: '0.3px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: 500,
  },
  zoneCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  zoneHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  zoneIcon: {
    fontSize: '22px',
    color: '#ef4444',
  },
  zoneName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f8fafc',
    display: 'block',
  },
  zoneId: {
    fontSize: '10px',
    color: '#64748b',
    fontWeight: 500,
  },
  zoneStatus: {
    marginLeft: 'auto',
    fontSize: '9px',
    fontWeight: 700,
    color: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(52, 211, 153, 0.2)',
    letterSpacing: '0.5px',
  },
  zoneGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  zoneStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  zsLabel: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#475569',
    letterSpacing: '0.5px',
  },
  zsValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#94a3b8',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  statCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    border: '1px solid rgba(51, 65, 85, 0.2)',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statIcon: {
    fontSize: '18px',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statLabel: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#475569',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#f8fafc',
    fontVariantNumeric: 'tabular-nums',
  },
  breachesSection: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    border: '1px solid rgba(51, 65, 85, 0.2)',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  breachesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  breachesTitle: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#f87171',
    letterSpacing: '0.8px',
  },
  breachesBadge: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#f87171',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: '1px 6px',
    borderRadius: '8px',
  },
  noBreaches: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
  },
  noBreachesIcon: {
    fontSize: '16px',
    color: '#34d399',
  },
  noBreachesText: {
    fontSize: '12px',
    color: '#64748b',
  },
  breachesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  breachItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '6px',
    borderLeft: '2px solid #ef4444',
  },
  breachVehicle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#f8fafc',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    minWidth: '80px',
  },
  breachTime: {
    fontSize: '10px',
    color: '#64748b',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  breachZone: {
    marginLeft: 'auto',
    fontSize: '10px',
    color: '#f59e0b',
    fontWeight: 600,
  },
  zoneVisual: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    border: '1px solid rgba(51, 65, 85, 0.2)',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  zoneVisualHeader: {},
  zvTitle: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.8px',
  },
  zoneMap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  zoneBox: {
    border: '2px dashed rgba(239, 68, 68, 0.5)',
    borderRadius: '8px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
  },
  zoneBoxLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#f87171',
    letterSpacing: '0.5px',
  },
  zoneCoords: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    fontSize: '10px',
    color: '#64748b',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  zoneLegend: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  legendLabel: {
    fontSize: '10px',
    color: '#64748b',
  },
};
