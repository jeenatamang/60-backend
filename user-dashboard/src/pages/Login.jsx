import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.sub}>Sign in to your account</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: '#f7f9f8'
  },
  card: {
    background: '#ffffff',
    border: '1px solid #d4e2da',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
  },
  header: { marginBottom: '28px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '6px' },
  sub: { color: '#5a7060', fontSize: '14px' },
  errorBox: {
    background: '#fff0f0',
    border: '1px solid #f0c0c0',
    color: '#b84a4a',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '11.5px',
    color: '#5a7060',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    fontWeight: '600'
  },
  input: {
    background: '#f7f9f8',
    border: '1px solid #c8d8ce',
    color: '#111',
    padding: '11px 14px',
    borderRadius: '9px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s'
  },
  button: {
    background: '#111',
    color: '#ffffff',
    border: 'none',
    padding: '13px',
    borderRadius: '9px',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '4px',
    letterSpacing: '0.01em'
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#5a7060',
    marginTop: '22px'
  }
};

export default Login;
