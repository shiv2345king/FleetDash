import React, { useEffect, useRef, useState } from 'react';

interface StatsBarProps {
  activeCount: number;
  isConnected: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ activeCount, isConnected }) => {
  const [throughput, setThroughput] = useState(0);
  const [packetRate, setPacketRate] = useState(0);
  const [latency, setLatency] = useState(0);
  const [eventsProcessed, setEventsProcessed] = useState(0);
  const packetRef = useRef(0);
  const eventRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate throughput metrics
      const packets = Math.floor(Math.random() * 500) + 200;
      packetRef.current += packets;
      setPacketRate(packets);
      setThroughput(prev => {
        const newVal = prev + Math.floor(Math.random() * 50) + 10;
        return newVal > 99999 ? 0 : newVal;
      });
      eventRef.current += Math.floor(Math.random() * 30) + 5;
      setEventsProcessed(eventRef.current);
      setLatency(Math.floor(Math.random() * 12) + 2);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatThroughput = (val: number): string => {
    if (val > 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
  };

  return (
    <footer style={styles.bar}>
      <div style={styles.section}>
        <div style={styles.stat}>
          <span style={styles.label}>THROUGHPUT</span>
          <span style={styles.value}>{formatThroughput(throughput)} <span style={styles.unit}>MB/s</span></span>
        </div>
        <div style={styles.divider} />
        <div style={styles.stat}>
          <span style={styles.label}>PACKET RATE</span>
          <span style={styles.value}>{packetRate.toLocaleString()} <span style={styles.unit}>pkt/s</span></span>
        </div>
        <div style={styles.divider} />
        <div style={styles.stat}>
          <span style={styles.label}>ACTIVE VEHICLES</span>
          <span style={{ ...styles.value, color: '#10b981' }}>{activeCount.toLocaleString()}</span>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.stat}>
          <span style={styles.label}>LATENCY</span>
          <span style={{ ...styles.value, color: latency < 8 ? '#34d399' : latency < 12 ? '#f59e0b' : '#ef4444' }}>
            {latency} <span style={styles.unit}>ms</span>
          </span>
        </div>
        <div style={styles.divider} />
        <div style={styles.stat}>
          <span style={styles.label}>EVENTS</span>
          <span style={styles.value}>{eventsProcessed.toLocaleString()}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.stat}>
          <span style={styles.label}>STATUS</span>
          <div style={styles.statusRow}>
            <span style={{ ...styles.statusDot, backgroundColor: isConnected ? '#10b981' : '#ef4444' }} />
            <span style={{ ...styles.value, color: isConnected ? '#34d399' : '#ef4444', fontSize: '11px' }}>
              {isConnected ? 'OPERATIONAL' : 'DEGRADED'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  bar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    height: '36px',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTop: '1px solid rgba(56, 189, 248, 0.1)',
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    flexShrink: 0,
    userSelect: 'none' as const,
    zIndex: 40,
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '8px',
    fontWeight: 700,
    color: '#475569',
    letterSpacing: '0.8px',
  },
  value: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#94a3b8',
    fontVariantNumeric: 'tabular-nums' as const,
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  unit: {
    fontSize: '9px',
    color: '#64748b',
    fontWeight: 500,
  },
  divider: {
    width: '1px',
    height: '20px',
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
  },
};
