import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('All fields are required');
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .ps-root {
          min-height: 100vh;
          width: 100vw;
          background: #050811;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .ps-card {
          width: 100%;
          max-width: 420px;
          height: 560px;
          background: #090e1a;
          border: 1px solid #00e676;
          border-radius: 20px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 0 30px rgba(0, 230, 118, 0.15);
          position: relative;
          box-sizing: border-box;
        }

        .ps-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .ps-title {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .ps-badge {
          width: 32px;
          height: 32px;
          background: #00e676;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(0, 230, 118, 0.6);
        }

        .ps-badge svg {
          width: 18px;
          height: 18px;
          fill: #050811;
        }

        .ps-field {
          position: relative;
          margin-bottom: 18px;
        }

        .ps-input {
          width: 100%;
          background: #eef2ff;
          border: none;
          border-radius: 12px;
          padding: 14px 44px 14px 18px;
          font-size: 15px;
          color: #1e293b;
          outline: none;
          box-sizing: border-box;
          font-weight: 500;
        }

        .ps-input::placeholder {
          color: #64748b;
        }

        .ps-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          fill: #64748b;
          pointer-events: none;
        }

        .ps-btn {
          width: 100%;
          background: #00e676;
          color: #050811;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          box-shadow: 0 0 20px rgba(0, 230, 118, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .ps-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 28px rgba(0, 230, 118, 0.6);
        }

        .ps-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ps-error {
          background: rgba(255, 71, 87, 0.15);
          border: 1px solid #ff4757;
          color: #ff6b81;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 16px;
          text-align: center;
        }

        .ps-footer {
          margin-top: 36px;
          text-align: center;
          font-size: 14px;
          color: #94a3b8;
        }

        .ps-link {
          color: #00e676;
          font-weight: 700;
          text-decoration: none;
          margin-left: 6px;
        }

        .ps-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="ps-card">
        <div className="ps-header">
          <h1 className="ps-title">LOGIN</h1>
          <div className="ps-badge">
            <svg viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
        </div>

        {error && <div className="ps-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="ps-field">
            <input
              type="email"
              className="ps-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <svg className="ps-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <div className="ps-field">
            <input
              type="password"
              className="ps-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <svg className="ps-icon" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </div>

          <button type="submit" disabled={loading} className="ps-btn">
            {loading ? 'Authenticating...' : 'Access Terminal'}
          </button>
        </form>

        <div className="ps-footer">
          Need an account?
          <Link to="/signup" className="ps-link">
            Create One
          </Link>
        </div>
      </div>
    </div>
  );
}