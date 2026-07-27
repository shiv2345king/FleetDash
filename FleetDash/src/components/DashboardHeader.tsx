interface HeaderProps {
  isConnected: boolean;
  activeCount: number;
}

export const DashboardHeader = ({ isConnected, activeCount }: HeaderProps) => {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <h1 style={styles.title}>FleetDash</h1>
        <span style={styles.subtitle}>Infotact High-Throughput Telemetry</span>
      </div>
      <div style={styles.metrics}>
        <div style={styles.badge}>
          Active Vehicles: <strong style={styles.count}>{activeCount}</strong>
        </div>
        <div style={styles.badge}>
          Status:{' '}
          <span style={{ color: isConnected ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
            ● {isConnected ? 'LIVE (Socket Connected)' : 'DISCONNECTED'}
          </span>
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
    backgroundColor: '#1e293b',
    color: '#ffffff',
    height: '64px',
    minHeight: '64px',
    flexShrink: 0, // Prevents header from collapsing when canvas resizes
    boxSizing: 'border-box' as const,
    borderBottom: '1px solid #334155',
    zIndex: 20,
  },
  brand: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: { margin: 0, fontSize: '18px', fontWeight: 'bold' as const, color: '#f8fafc' },
  subtitle: { fontSize: '11px', color: '#94a3b8' },
  metrics: { display: 'flex', gap: '12px', alignItems: 'center' },
  badge: {
    padding: '6px 12px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#cbd5e1',
  },
  count: { color: '#38bdf8' },
};