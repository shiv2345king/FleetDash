// OverviewPanel.tsx
import React, { useEffect, useState } from 'react';
import type { Vehicle, GeofenceZone } from '../types/Fleet';
import { VehicleRangeChart } from './VehicleRangeChart';

interface OverviewPanelProps {
  activeCount: number;
  alertCount: number;
  isConnected: boolean;
  telemetryBufferRef: React.RefObject<Map<string, Vehicle> | null> | React.MutableRefObject<Map<string, Vehicle>>;
  geofence: GeofenceZone;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  activeCount,
  alertCount,
  isConnected,
  telemetryBufferRef,
  geofence,
}) => {
  const [uptime, setUptime] = useState(0);
  const [dataRate, setDataRate] = useState(0);
  const [eventsPerSec, setEventsPerSec] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const metricsInterval = setInterval(() => {
      setDataRate(Math.floor(Math.random() * 800) + 400);
      setEventsPerSec(Math.floor(Math.random() * 200) + 80);
    }, 2000);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const statCards = [
    { label: 'ACTIVE VEHICLES', value: activeCount.toLocaleString(), color: '#38bdf8', icon: '⚡', subtitle: 'Real-time tracked' },
    { label: 'DATA THROUGHPUT', value: `${(dataRate / 1000).toFixed(1)}K`, color: '#34d399', icon: '📡', subtitle: 'pts/s inbound' },
    { label: 'ALERTS', value: alertCount.toString(), color: '#f87171', icon: '⚠️', subtitle: 'Active geofence breaches' },
    { label: 'UPTIME', value: formatUptime(uptime), color: '#a78bfa', icon: '⏱️', subtitle: 'System running' },
    { label: 'EVENT RATE', value: `${eventsPerSec}`, color: '#f59e0b', icon: '📊', subtitle: 'events/s processed' },
    { label: 'SYSTEM HEALTH', value: isConnected ? 'OPERATIONAL' : 'DEGRADED', color: isConnected ? '#34d399' : '#ef4444', icon: '🟢', subtitle: isConnected ? 'All systems normal' : 'Connection lost' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard Overview</h2>
        <span style={styles.subtitle}>Real-time fleet telemetry summary</span>
      </div>

      <div style={styles.grid}>
        {statCards.map((card) => (
          <div key={card.label} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>{card.icon}</span>
              <span style={styles.cardLabel}>{card.label}</span>
            </div>
            <span style={{ ...styles.cardValue, color: card.color }}>{card.value}</span>
            <span style={styles.cardSubtitle}>{card.subtitle}</span>
          </div>
        ))}
      </div>

      <div style={styles.chartSection}>
        <VehicleRangeChart telemetryBufferRef={telemetryBufferRef as React.MutableRefObject<Map<string, Vehicle>>} geofence={geofence} />
      </div>

      {/* FIXED: Added missing closing </div> for quickStats */}
      <div style={styles.quickStats}>
        <div style={styles.quickStat}>
          <span style={styles.qsLabel}>System Mode</span>
          <span style={styles.qsValue}>High-Throughput</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.qsLabel}>Geofence Zones</span>
          <span style={styles.qsValue}>1 Active</span>
        </div>
        <div style={styles.quickStat}>
          <span style={styles.qsLabel}>Data Pipeline</span>
          <span style={styles.qsValue}>Event-Driven</span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { height: '100%', padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  header: { display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 },
  title: { margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.3px' },
  subtitle: { fontSize: '12px', color: '#64748b', fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', flexShrink: 0 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(51, 65, 85, 0.3)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', backdropFilter: 'blur(8px)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '8px' },
  cardIcon: { fontSize: '16px' },
  cardLabel: { fontSize: '9px', fontWeight: 700, color: '#64748b', letterSpacing: '0.8px' },
  cardValue: { fontSize: '28px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 },
  cardSubtitle: { fontSize: '10px', color: '#475569', fontWeight: 500 },
  chartSection: { flexShrink: 0 },
  quickStats: { display: 'flex', gap: '12px', flexWrap: 'wrap', flexShrink: 0 },
  quickStat: { backgroundColor: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(51, 65, 85, 0.2)', borderRadius: '8px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px' },
  qsLabel: { fontSize: '8px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px' },
  qsValue: { fontSize: '12px', fontWeight: 600, color: '#94a3b8' },
};