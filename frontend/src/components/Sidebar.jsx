import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Zap, History, FileText, LogOut, Shield,Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/scanner', icon: Zap, label: 'Scanner' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  {to :'/Settings',icon:Settings,label:'Settings'},
];

const C = {
  green: '#00ff88',
  bg: '#080c10',
  bg2: '#0d1117',
  border: 'rgba(0,255,136,0.18)',
  text: '#c9d1d9',
  textDim: '#8b949e',
  red: '#ff4757',
};

export default function Sidebar(){
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside style={{ width: '16rem', minHeight: '100vh', background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(16px)', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        @keyframes sc-pulse{0%,100%{box-shadow:0 0 20px rgba(0,255,136,0.5),0 0 45px rgba(0,255,136,0.15)}50%{box-shadow:0 0 28px rgba(0,255,136,0.7),0 0 60px rgba(0,255,136,0.25)}}
        .sc-logo-box{animation:sc-pulse 3s ease-in-out infinite}
        .sc-navlink{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;font-size:0.85rem;font-family:'Inter',sans-serif;color:${C.textDim};text-decoration:none;transition:all .2s;border-left:2px solid transparent}
        .sc-navlink:hover{color:#fff;background:rgba(0,255,136,0.05);transform:translateX(4px)}
        .sc-navlink.active{color:${C.green};background:rgba(0,255,136,0.08);border-left:2px solid ${C.green};box-shadow:inset 0 0 20px rgba(0,255,136,0.06)}
      `}</style>

      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="sc-logo-box" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.bg, background: C.green }}>
            <Shield size={24} strokeWidth={2.5} fill={C.bg} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.15rem', color: C.green, letterSpacing: '1px' }}>
              PROMPT<span style={{ color: C.textDim }}>SHIELD</span>
            </h1>
            <p style={{ fontSize: '0.65rem', color: C.textDim, letterSpacing: '1px', marginTop: '2px' }}>// SECURE GATEWAY</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sc-navlink${isActive ? ' active' : ''}`}>
            <Icon size={18} strokeWidth={2} />
            <span style={{ letterSpacing: '0.5px' }}>{label.toUpperCase()}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '1rem', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.bg, background: C.green, fontSize: '0.85rem', fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.7rem', color: C.textDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.7rem 0.9rem',
            fontSize: '0.8rem',
            color: '#ff8a93',
            background: 'rgba(255,71,87,0.06)',
            border: '1px solid rgba(255,71,87,0.25)',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            fontFamily: "'Share Tech Mono', monospace",
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,71,87,0.15)';
            e.currentTarget.style.borderColor = '#ff4757';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,71,87,0.25)';
            e.currentTarget.style.transform = 'translateX(3px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,71,87,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,71,87,0.25)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <LogOut size={16} strokeWidth={2} />
          LOGOUT
        </button>
      </div>
    </aside>
  );
}