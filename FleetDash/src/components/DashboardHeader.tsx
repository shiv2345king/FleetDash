import React, { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  isConnected: boolean;
  activeCount: number;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ isConnected, activeCount }) => {
  const [uptime, setUptime] = useState(0);
  const [dataRate, setDataRate] = useState(0);
  const startTimeRef = useRef(Date.now());
  const dataPointsRef = useRef(0);

  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const dataRateInterval = setInterval(() => {
      const points = dataPointsRef.current;
      setDataRate(Math.round(points / 5));
      dataPointsRef.current = 0;
    }, 5000);

    // Simulate data points
    const dataSim = setInterval(() => {
      dataPointsRef.current += Math.floor(Math.random() * 120) + 80;
    }, 100);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(dataRateInterval);
      clearInterval(dataSim);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <div style={styles.logoContainer}>
          <div style={styles.logoGlow} />
          <span style={styles.logoIcon}>⬡</span>
        </div>
        <div>
          <h1 style={styles.title}>
            <span style={styles.titleGradient}>FleetDash</span>
          </h1>
          <span style={styles.subtitle}>High-Throughput Event-Driven Telemetry Engine</span>
        </div>
      </div>

      <div style={styles.metricsGroup}>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>DATA RATE</span>
          <span style={styles.metricValue}>{dataRate.toLocaleString()} <span style={styles.metricUnit}>pts/s</span></span>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>ACTIVE VEHICLES</span>
          <span style={styles.metricValue}>{activeCount.toLocaleString()}</span>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>UPTIME</span>
          <span style={styles.metricValueMono}>{formatUptime(uptime)}</span>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>SYSTEM</span>
          <div style={styles.statusWrapper}>
            <span style={{ ...styles.statusDot, backgroundColor: isConnected ? '#10b981' : '#ef4444', animation: isConnected ? 'pulse-glow 2s ease-in-out infinite' : 'none' }} />
            <span style={{ ...styles.statusText, color: isConnected ? '#10b981' : '#ef4444' }}>{isConnected ? 'LIVE' : 'OFF'}</span>
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    height: '64px',
    borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
    userSelect: 'none' as const,
    flexShrink: 0,
    position: 'relative' as const,
    zIndex: 50,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoContainer: {
    position: 'relative' as const,
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute' as const,
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: '8px',
    filter: 'blur(8px)',
    animation: 'pulse-glow 2s ease-in-out infinite',
  },
  logoIcon: {
    fontSize: '20px',
    color: '#38bdf8',
    position: 'relative' as const,
    zIndex: 1,
    textShadow: '0 0 12px rgba(56, 189, 248, 0.6)',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 800,
    letterSpacing: '0.5px',
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #38bdf8, #818cf8, #34d399)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'shimmer 4s ease-in-out infinite',
  },
  subtitle: {
    fontSize: '10px',
    color: '#64748b',
    fontWeight: 500,
    letterSpacing: '0.3px',
    textTransform: 'uppercase' as const,
  },
  metricsGroup: {
    display: 'flex',
    gap: '10px',
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(51, 65, 85, 0.4)',
    backdropFilter: 'blur(4px)',
    minWidth: '90px',
  },
  metricLabel: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.8px',
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#38bdf8',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.3,
  },
  metricValueMono: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#a78bfa',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    lineHeight: 1.3,
  },
  metricUnit: {
    fontSize: '10px',
    color: '#64748b',
    fontWeight: 500,
  },
  statusWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px',
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
};
