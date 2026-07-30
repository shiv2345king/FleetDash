import React from 'react';

interface HeaderProps {
  isConnected: boolean;
  activeCount: number;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ isConnected, activeCount }) => {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <div style={styles.logoMark} />
        <div>
          <h1 style={styles.title}>FleetDash</h1>
          <span style={styles.subtitle}>Infotact High-Throughput Telemetry Engine</span>
        </div>
      </div>

      <div style={styles.metricsGroup}>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>ACTIVE VEHICLES</span>
          <span style={styles.metricValue}>{activeCount.toLocaleString()}</span>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>SYSTEM STATUS</span>
          <div style={styles.statusWrapper}>
            <span style={{ ...styles.statusDot, backgroundColor: isConnected ? '#10b981' : '#ef4444' }} />
            <span style={styles.statusText}>{isConnected ? 'LIVE STREAM' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: '#0f172a',
    height: '64px',
    borderBottom: '1px solid #1e293b',
    userSelect: 'none' as const,
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoMark: {
    width: '12px',
    height: '12px',
    backgroundColor: '#38bdf8',
    borderRadius: '2px',
    boxShadow: '0 0 10px #38bdf8',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#f8fafc',
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 500,
  },
  metricsGroup: {
    display: 'flex',
    gap: '16px',
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #334155',
  },
  metricLabel: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.5px',
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#38bdf8',
    fontVariantNumeric: 'tabular-nums',
  },
  statusWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#f8fafc',
  },
};