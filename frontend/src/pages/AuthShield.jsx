import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldHalf, Key, User, Lock, Mail, ShieldOff, Eye, EyeOff , ArrowLeft} from 'lucide-react';
function getPasswordStrength(password) {
  if (!password) return { label: '', score: 0, color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', score: 1, color: '#ff4757' };
  if (score === 3) return { label: 'Medium', score: 2, color: '#ffa502' };
  return { label: 'Strong', score: 3, color: '#00ff88' };
}

export default function AuthShield({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [unlocked, setUnlocked] = useState(false);
  const [flipped, setFlipped] = useState(initialMode === 'signup');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const pwStrength = getPasswordStrength(signupForm.password);

  const closeDoor = () => {
    setUnlocked(false);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginForm.email || !loginForm.password) return setError('All fields are required');
    setLoading(true);
    try {
      const { data } = await loginUser(loginForm);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      return setError('All fields are required');
    }
    if (signupForm.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (signupForm.password !== signupForm.confirm) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      const { data } = await registerUser({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const C = { green: '#00ff88', greenDim: '#10b981', bg: '#030712' };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',minHeight: '100vh', width: '100vw', background: C.bg, overflow: 'hidden',
      position: 'relative', fontFamily: "'Inter', sans-serif"
    }}>
          <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: 25, left: 25, zIndex: 100, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,136,0.25)',
          borderRadius: 10, padding: '8px 14px', color: '#e4e4e7',fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: '0.3s ease'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,136,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <ArrowLeft size={16} /> Back
      </button>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes float{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,-20px) scale(1.15)}}
        @keyframes pulseGlow{
          0%,100%{transform:scale(1) rotate(0deg);filter:drop-shadow(0 0 15px ${C.green}) drop-shadow(0 0 30px rgba(0,255,136,0.5))}
          50%{transform:scale(1.12) rotate(-3deg);filter:drop-shadow(0 0 35px ${C.green}) drop-shadow(0 0 60px rgba(0,255,136,0.7))}
        }
        @keyframes shimmerRing{
          0%{opacity:0;transform:scale(0.8)}
          50%{opacity:0.6;transform:scale(1.3)}
          100%{opacity:0;transform:scale(1.6)}
        }
        .as-shield-ring{
          position:absolute;inset:-15px;border:2px solid ${C.green};border-radius:50%;
          animation:shimmerRing 2.5s ease-out infinite;pointer-events:none;
        }
@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1); }
}
.as-sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: ${C.green};
  border-radius: 50%;
  box-shadow: 0 0 8px 3px rgba(0,255,136,0.6);
  animation: twinkle 2.5s ease-in-out infinite;
}
        .as-orb{position:absolute;width:450px;height:450px;background:radial-gradient(circle,rgba(0,255,136,0.25),transparent 70%);filter:blur(100px);animation:float 6s ease-in-out infinite alternate}
        .as-orb.two{background:radial-gradient(circle,rgba(16,185,129,0.2),transparent 70%);animation-delay:-3s}
        .as-input{width:100%;padding:12px 40px 12px 15px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:#fff;font-size:14px;outline:none;transition:0.3s ease;box-sizing:border-box}
        .as-input::placeholder{color:#64748b}
        .as-input:focus{border-color:${C.green};box-shadow:0 0 12px rgba(0,255,136,0.3);background:rgba(255,255,255,0.06)}
        .as-btn{width:100%;padding:12px;background:linear-gradient(90deg,${C.greenDim},${C.green});border:none;border-radius:10px;color:${C.bg};font-weight:700;font-size:15px;cursor:pointer;margin-top:10px;box-shadow:0 0 15px rgba(0,255,136,0.4);transition:0.3s ease}
        .as-btn:hover:not(:disabled){box-shadow:0 0 25px rgba(0,255,136,0.7);transform:translateY(-2px)}
        .as-btn:disabled{opacity:0.6;cursor:not-allowed}
        .as-lock-btn{color:${C.green};cursor:pointer;background:none;border:none;display:flex;align-items:center}
        .as-lock-btn:hover{transform:scale(1.2)}
      `}</style>

      <div className="as-orb" style={{ top: '10%', left: '15%' }}></div>
      <div className="as-orb two" style={{ top: '50%', left: '60%' }}></div>

      <div style={{ position: 'relative', width: 400, height: 580, perspective: 1200 }}>

        {!unlocked && (
          <div onClick={() => setUnlocked(true)} style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'
          }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="as-shield-ring"></div>
              <span className="as-sparkle" style={{top:'5%',left:'10%',animationDelay:'0.2s'}}></span>
              <span className="as-sparkle" style={{top:'15%',right:'8%',animationDelay:'0.4s'}}></span>
              <span className="as-sparkle" style={{bottom:'10%',left:'5%',animationDelay:'0.8s'}}></span>
              <span className="as-sparkle" style={{bottom:'20%',right:'12%',animationDelay:'1.2s'}}></span>
              <span className="as-sparkle" style={{ top: '45%', left: '-5%', animationDelay: '0.6s' }}></span>
              <span className="as-sparkle" style={{ top: '50%', right: '-8%', animationDelay: '1s' }}></span> 
              <ShieldHalf size={80} color={C.green} style={{ animation: 'pulseGlow 2.2s ease-in-out infinite', position: 'relative', zIndex: 1 }} />
            </div>
            <span style={{
              color: '#e4e4e7', fontSize: 13, letterSpacing: 2, marginTop: 15, fontWeight: 600,
              textTransform: 'uppercase', background: 'rgba(0,255,136,0.1)', padding: '6px 16px',
              borderRadius: 20, border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Key size={13} /> Open Shield
            </span>
          </div>
        )}

        <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', pointerEvents: unlocked ? 'none' : 'auto' }}>
          <div style={{
            width: '50%', height: '100%', background: 'rgba(13,18,30,0.95)', backdropFilter: 'blur(20px)',
            borderTop: `2px solid ${C.green}`, borderBottom: `2px solid ${C.green}`, borderLeft: `2px solid ${C.green}`,
            borderRadius: '20px 0 0 20px', transition: 'transform 0.8s cubic-bezier(0.77,0,0.175,1)',
            transform: unlocked ? 'translateX(-100%)' : 'translateX(0)'
          }} />
          <div style={{
            width: '50%', height: '100%', background: 'rgba(13,18,30,0.95)', backdropFilter: 'blur(20px)',
            borderTop: `2px solid ${C.green}`, borderBottom: `2px solid ${C.green}`, borderRight: `2px solid ${C.green}`,
            borderRadius: '0 20px 20px 0', transition: 'transform 0.8s cubic-bezier(0.77,0,0.175,1)',
            transform: unlocked ? 'translateX(100%)' : 'translateX(0)'
          }} />
        </div>

        <div style={{
          width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.175,0.885,0.32,1.275)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)'
        }}>

          {/* FRONT — LOGIN */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(25px)', border: '1px solid rgba(0,255,136,0.25)',
            borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 20px rgba(0,255,136,0.15)',
            padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#fff', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>LOGIN</h2>
              <button className="as-lock-btn" onClick={closeDoor} title="Close Shield"><ShieldOff size={20} /></button>
            </div>

            {error && !flipped && (
              <div style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid #ff4757', color: '#ff6b81', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 15, textAlign: 'center' }}>{error}</div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <input className="as-input" type="email" placeholder="Enter your email" required
                  value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
                <Mail size={16} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
              </div>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <input className="as-input" type={showLoginPw ? 'text' : 'password'} placeholder="Enter your password" required
                  value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowLoginPw(!showLoginPw)}
                  style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex' }}>
                  {showLoginPw ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="as-btn">{loading ? 'Authenticating...' : 'Access Terminal'}</button>
              <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginTop: 25 }}>
                Need an account? <span onClick={() => { setFlipped(true); setError(''); }} style={{ color: C.green, fontWeight: 600, cursor: 'pointer' }}>Create One</span>
              </p>
            </form>
          </div>

          {/* BACK — SIGNUP */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(25px)', border: '1px solid rgba(0,255,136,0.25)',
            borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 20px rgba(0,255,136,0.15)',
            padding: '35px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>REGISTER</h2>
              <button className="as-lock-btn" onClick={closeDoor} title="Close Shield"><ShieldOff size={20} /></button>
            </div>

            {error && flipped && (
              <div style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid #ff4757', color: '#ff6b81', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 15, textAlign: 'center' }}>{error}</div>
            )}

            <form onSubmit={handleSignupSubmit}>
              <div style={{ position: 'relative', marginBottom: 15 }}>
                <input className="as-input" type="text" placeholder="Enter your name" required
                  value={signupForm.name} onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} />
                <User size={16} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
              </div>
              <div style={{ position: 'relative', marginBottom: 15 }}>
                <input className="as-input" type="email" placeholder="Enter your email" required
                  value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} />
                <Mail size={16} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
              </div>
              <div style={{ position: 'relative', marginBottom: 15 }}>
                <input className="as-input" type={showSignupPw ? 'text' : 'password'} placeholder="Create password" required
                  value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                  style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowSignupPw(!showSignupPw)}
                  style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex' }}>
                  {showSignupPw ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {signupForm.password && (
  <div style={{ marginTop: -8, marginBottom: 15 }}>
    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
      {[1, 2, 3].map((seg) => (
        <div key={seg} style={{
          flex: 1, height: 4, borderRadius: 2,background: seg <= pwStrength.score ? pwStrength.color : 'rgba(255,255,255,0.1)',  transition: 'background 0.3s ease'
        }} />
      ))}
    </div>
    <span style={{ fontSize: 11, color: pwStrength.color, fontWeight: 600, letterSpacing: 0.5 }}>
      {pwStrength.label}
    </span>
  </div>
)}
              <div style={{ position: 'relative', marginBottom: 15 }}>
                <input className="as-input" type={showConfirmPw ? 'text' : 'password'} placeholder="Confirm password" required
                  value={signupForm.confirm}
                  onChange={e => setSignupForm({ ...signupForm, confirm: e.target.value })}
                  style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                  style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex' }}>
                  {showConfirmPw ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="as-btn">{loading ? 'Creating...' : 'Create Shield ID'}</button>
              <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
                Already registered? <span onClick={() => { setFlipped(false); setError(''); }} style={{ color: C.green, fontWeight: 600, cursor: 'pointer' }}>Sign In</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}