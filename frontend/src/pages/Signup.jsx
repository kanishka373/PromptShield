import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      return setError('All fields are required');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-body">
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .ps-body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100vw;
          background: #030712;
          overflow: hidden;
          position: relative;
        }

        .bg-orb {
          position: absolute;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.25), transparent 70%);
          top: 10%;
          left: 15%;
          filter: blur(100px);
          animation: float 6s ease-in-out infinite alternate;
        }

        .bg-orb.two {
          top: 50%;
          left: 60%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent 70%);
          animation-delay: -3s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.15); }
        }

        .auth-wrapper {
          position: relative;
          width: 400px;
          height: 580px;
          perspective: 1200px;
        }

        .shield-doors {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: flex;
          pointer-events: auto;
          transition: visibility 0.8s;
        }

        .door {
          width: 50%;
          height: 100%;
          background: rgba(13, 18, 30, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
          border-top: 2px solid #00ff88;
          border-bottom: 2px solid #00ff88;
        }

        .door-left {
          border-left: 2px solid #00ff88;
          border-radius: 20px 0 0 20px;
          justify-content: flex-end;
        }

        .door-right {
          border-right: 2px solid #00ff88;
          border-radius: 0 20px 20px 0;
          justify-content: flex-start;
        }

        .shield-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 60;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.5s ease;
        }

        .shield-icon {
          font-size: 75px;
          color: #00ff88;
          text-shadow: 0 0 25px rgba(0, 255, 136, 0.8), 0 0 50px rgba(0, 255, 136, 0.4);
          animation: pulseGlow 2s infinite alternate;
        }

        @keyframes pulseGlow {
          0% { transform: scale(1); filter: drop-shadow(0 0 10px #00ff88); }
          100% { transform: scale(1.08); filter: drop-shadow(0 0 25px #00ff88); }
        }

        .unlock-text {
          color: #e4e4e7;
          font-size: 13px;
          letter-spacing: 2px;
          margin-top: 15px;
          font-weight: 600;
          text-transform: uppercase;
          background: rgba(0, 255, 136, 0.1);
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid rgba(0, 255, 136, 0.3);
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
        }

        .auth-wrapper.unlocked .door-left {
          transform: translateX(-100%);
        }

        .auth-wrapper.unlocked .door-right {
          transform: translateX(100%);
        }

        .auth-wrapper.unlocked .shield-badge {
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0.5);
        }

        .auth-wrapper.unlocked .shield-doors {
          pointer-events: none;
        }

        .card-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(0, 255, 136, 0.25);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 255, 136, 0.15);
          padding: 35px 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 {
          color: #fff;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .lock-btn {
          color: #00ff88;
          cursor: pointer;
          font-size: 18px;
          transition: 0.3s;
        }

        .lock-btn:hover {
          transform: scale(1.2);
        }

        .input-box {
          position: relative;
          margin-bottom: 15px;
        }

        .input-box input {
          width: 100%;
          padding: 12px 40px 12px 15px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: 0.3s ease;
        }

        .input-box input:focus {
          border-color: #00ff88;
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.3);
          background: rgba(255, 255, 255, 0.06);
        }

        .input-box i {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
        }

        .btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(90deg, #10b981, #00ff88);
          border: none;
          border-radius: 10px;
          color: #030712;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          margin-top: 10px;
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
          transition: 0.3s ease;
        }

        .btn:hover:not(:disabled) {
          box-shadow: 0 0 25px rgba(0, 255, 136, 0.7);
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-banner {
          background: rgba(255, 71, 87, 0.15);
          border: 1px solid #ff4757;
          color: #ff6b81;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 15px;
          text-align: center;
        }

        .switch-text {
          color: #9ca3af;
          font-size: 13px;
          text-align: center;
          margin-top: 20px;
        }

        .switch-text a {
          color: #00ff88;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      <div className="bg-orb"></div>
      <div className="bg-orb two"></div>

      <div className={`auth-wrapper ${isUnlocked ? 'unlocked' : ''}`}>
        
        {/* SHIELD SPLIT DOOR OVERLAY */}
        <div className="shield-badge" onClick={() => setIsUnlocked(true)}>
          <i className="fa-solid fa-shield-halved shield-icon"></i>
          <span className="unlock-text">
            <i className="fa-solid fa-key" style={{ marginRight: '6px' }}></i>
            Open Shield
          </span>
        </div>

        <div className="shield-doors">
          <div className="door door-left"></div>
          <div className="door door-right"></div>
        </div>

        {/* REGISTER CARD */}
        <div className="card-container">
          <div className="card-face">
            <div className="top-header">
              <h2>REGISTER</h2>
              <i 
                className="fa-solid fa-shield-cat lock-btn" 
                title="Close Shield"
                onClick={() => setIsUnlocked(false)}
              ></i>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required 
                />
                <i className="fa-solid fa-user"></i>
              </div>

              <div className="input-box">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required 
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="input-box">
                <input 
                  type="password" 
                  placeholder="Create password" 
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required 
                />
                <i className="fa-solid fa-lock"></i>
              </div>

              <div className="input-box">
                <input 
                  type="password" 
                  placeholder="Confirm password" 
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required 
                />
                <i className="fa-solid fa-lock"></i>
              </div>

              <button type="submit" disabled={loading} className="btn">
                {loading ? 'Creating...' : 'Create Shield ID'}
              </button>

              <p className="switch-text">
                Already registered? <Link to="/login">Sign In</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}