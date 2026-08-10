// AuthPage.tsx
import React, { useState } from 'react';

interface AuthPageProps {
  onLogin: (email: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError('All fields are required');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Store auth state in localStorage for persistence
      localStorage.setItem('fleetDashAuth', JSON.stringify({ email, isAuthenticated: true }));
      onLogin(email);
    }, 800);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setConfirmPassword('');
  };

  return (
    <div style={styles.container}>
      {/* Inject Keyframe Animations for UI Effects */}
      <style>{`
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Animated background grid */}
      <div style={styles.bgGrid} />

      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brandSection}>
          <div style={styles.logoContainer}>
            <div style={styles.logoGlow} />
            <span style={styles.logoIcon}>⬡</span>
          </div>
          <h1 style={styles.brandName}>
            <span style={styles.brandGradient}>FleetDash</span>
          </h1>
          <p style={styles.brandSubtitle}>High-Throughput Fleet Telemetry</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={styles.formSubtitle}>
            {isSignUp ? 'Register to access the fleet dashboard' : 'Sign in to continue to the dashboard'}
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fleetdash.io"
              style={styles.input}
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loadingText}>Authenticating...</span>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button
            type="button"
            onClick={toggleMode}
            style={styles.toggleBtn}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create One"}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>FleetDash v1.0 — Event-Driven Telemetry Engine</span>
        </div>
      </div> {/* FIXED: Added missing </div> for styles.card */}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b0f19',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '420px',
    maxWidth: '90vw',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(56, 189, 248, 0.15)',
    borderRadius: '16px',
    padding: '40px 36px 24px',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.05)',
    animation: 'slide-in-up 0.5s ease-out',
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  logoContainer: {
    position: 'relative',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: '12px',
    filter: 'blur(10px)',
    animation: 'pulse-glow 2s ease-in-out infinite',
  },
  logoIcon: {
    fontSize: '28px',
    color: '#38bdf8',
    position: 'relative',
    zIndex: 1,
    textShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
  },
  brandName: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '0.5px',
  },
  brandGradient: {
    background: 'linear-gradient(135deg, #38bdf8, #818cf8, #34d399)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'shimmer 4s ease-in-out infinite',
  },
  brandSubtitle: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 500,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#f8fafc',
    textAlign: 'center',
  },
  formSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
    textAlign: 'center',
    marginTop: '-8px',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#f87171',
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'center',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(51, 65, 85, 0.4)',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#38bdf8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.5px',
    marginTop: '4px',
  },
  loadingText: {
    opacity: 0.7,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
  },
  dividerText: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 500,
  },
  toggleBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    borderTop: '1px solid rgba(51, 65, 85, 0.3)',
    paddingTop: '16px',
  },
  footerText: {
    fontSize: '10px',
    color: '#475569',
    fontWeight: 500,
  },
};