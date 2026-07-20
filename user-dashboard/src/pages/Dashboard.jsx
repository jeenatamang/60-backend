import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <span style={styles.brand}>Dashboard</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
      </div>

      <div style={styles.content}>
        <div style={styles.welcome}>
          <h1 style={styles.title}>Welcome back{user.name ? `, ${user.name}` : ''}</h1>
          <p style={styles.sub}>You're successfully authenticated.</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardAccent} />
          <div style={styles.cardBody}>
            <p style={styles.cardLabel}>Signed in as</p>
            <p style={styles.cardValue}>{user.email || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f7f9f8'
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: '#ffffff',
    borderBottom: '1px solid #d4e2da'
  },
  brand: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111',
    letterSpacing: '-0.01em'
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #c8d8ce',
    color: '#5a7060',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  content: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '48px 24px'
  },
  welcome: {
    marginBottom: '28px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '6px',
    letterSpacing: '-0.02em'
  },
  sub: {
    fontSize: '14px',
    color: '#5a7060'
  },
  card: {
    background: '#ffffff',
    border: '1px solid #d4e2da',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    display: 'flex'
  },
  cardAccent: {
    width: '5px',
    background: '#7aab90',
    flexShrink: 0
  },
  cardBody: {
    padding: '20px 24px'
  },
  cardLabel: {
    fontSize: '11.5px',
    color: '#5a7060',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    fontWeight: '600',
    marginBottom: '6px'
  },
  cardValue: {
    fontSize: '15px',
    color: '#111',
    fontWeight: '500'
  }
};

export default Dashboard;
