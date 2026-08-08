import React from 'react';

export type ViewType = 'overview' | 'livemap' | 'geofence';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isConnected: boolean;
  alertCount: number;
  activeCount: number;
  onLogout?: () => void;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: '◉' },
  { id: 'livemap', label: 'Live Map', icon: '⌗' },
  { id: 'geofence', label: 'Geofence', icon: '⊞' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  isConnected,
  alertCount,
  activeCount,
  onLogout,
}) => {
  return (
    <nav style={styles.sidebar}>
      {/* Brand / Logo */}
      <div style={styles.brandSection}>
        <div style={styles.logoContainer}>
          <div style={styles.logoGlow} />
          <span style={styles.logoIcon}>⬡</span>
        </div>
        <span style={styles.brandName}>FleetDash</span>
      </div>

      {/* Navigation Items */}
      <div style={styles.navSection}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                borderColor: isActive ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
              }}
            >
              <span style={{ ...styles.navIcon, color: isActive ? '#38bdf8' : '#64748b' }}>
                {item.icon}
              </span>
              <span style={{ ...styles.navLabel, color: isActive ? '#f8fafc' : '#94a3b8' }}>
                {item.label}
              </span>
              {item.id === 'overview' && alertCount > 0 && (
                <span style={styles.alertBadge}>{alertCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status & Logout */}
      <div style={styles.bottomSection}>
        <div style={styles.statusRow}>
          <span style={{ ...styles.statusDot, backgroundColor: isConnected ? '#10b981' : '#ef4444' }} />
          <span style={styles.statusText}>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
        </div>
        <div style={styles.vehicleCount}>
          <span style={styles.vehicleCountValue}>{activeCount.toLocaleString()}</span>
          <span style={styles.vehicleCountLabel}>vehicles</span>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button onClick={onLogout} style={styles.logoutBtn}>
            <span style={styles.logoutIcon}>↩</span>
            <span style={styles.logoutText}>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '200px',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    borderRight: '1px solid rgba(56, 189, 248, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    userSelect: 'none',
    zIndex: 40,
  },
  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 16px 20px',
    borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
  },
  logoContainer: {
    position: 'relative',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: '6px',
    filter: 'blur(6px)',
  },
  logoIcon: {
    fontSize: '16px',
    color: '#38bdf8',
    position: 'relative',
    zIndex: 1,
    textShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
  },
  brandName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f8fafc',
    letterSpacing: '0.3px',
  },
  navSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px 10px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    position: 'relative',
  },
  navIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  navLabel: {
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.2px',
  },
  alertBadge: {
    position: 'absolute',
    right: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    fontSize: '9px',
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  bottomSection: {
    padding: '14px 16px',
    borderTop: '1px solid rgba(51, 65, 85, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    animation: 'pulse-glow 2s ease-in-out infinite',
  },
  statusText: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.5px',
  },
  vehicleCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  vehicleCountValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#38bdf8',
    fontVariantNumeric: 'tabular-nums',
  },
  vehicleCountLabel: {
    fontSize: '9px',
    color: '#64748b',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '4px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    width: '100%',
  },
  logoutIcon: {
    fontSize: '14px',
    color: '#f87171',
  },
  logoutText: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#f87171',
    letterSpacing: '0.3px',
  },
};