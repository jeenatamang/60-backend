import { useState } from 'react';
import api from './api';
import './App.css';

function App() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setStatus('loading');
    setError(null);
    setData(null);
    try {
      const res = await api.post('/register', {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Password123'
      });
      setData(res.data);
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="badge">Day 49</div>
        <h1>API Connection Test</h1>
      </div>

      <div className="card-footer">
        <button
          className={`btn ${status === 'loading' ? 'btn-loading' : ''}`}
          onClick={testConnection}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <span className="spinner" />
              Connecting...
            </>
          ) : (
            'Test Connection'
          )}
        </button>

        {status === 'success' && (
          <div className="result result-success">
            <div className="result-title">
              <span className="dot dot-green" />
              User registered successfully
            </div>
            <pre className="result-code">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}

        {status === 'error' && (
          <div className="result result-error">
            <div className="result-title">
              <span className="dot dot-red" />
              Connection failed
            </div>
            <p className="result-message">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
