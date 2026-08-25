import { motion } from 'framer-motion';

const C = {
  green: '#00ff88',
  bg2: '#0d1117',
  border: 'rgba(0,255,136,0.18)',
  textDim: '#8b949e',
  red: '#ff4757',
};

export default function StatsCard({ icon: Icon, label, value, color = 'primary', delay = 0 }) {
  const accents = {
    primary: C.green,
    danger: C.red,
    warning: '#ffb020',
    success: C.green,
    accent: '#00d4ff',
  };
  const accent = accents[color] || C.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="sc-stat-card shiny-card"
      style={{
        background: C.bg2,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${accent}`,
        padding: '1.5rem',
        position: 'relative',
        transition: 'all .25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 0 25px ${accent}33`;
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <style>{`
        @keyframes sc-blink{0%,100%{opacity:1}50%{opacity:0.2}}
        .sc-live-dot{width:6px;height:6px;border-radius:50%;background:${accent};animation:sc-blink 1.2s infinite;display:inline-block}
        .shiny-card{position:relative;overflow:hidden}
        .shiny-card::before{content:'';position:absolute;top:0;left:-150%;width:60%;height:100%;background:linear-gradient(120deg,transparent,rgba(0,255,136,0.15),transparent);transform:skewX(-20deg);transition:left 0.6s ease}
        .shiny-card:hover::before{left:150%}
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${accent}18`, border: `1px solid ${accent}40` }}>
          <Icon size={18} strokeWidth={2} color={accent} />
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace",
          color: accent, letterSpacing: '1px'
        }}>
          <span className="sc-live-dot"></span> LIVE
        </span>
      </div>
      <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
        {value ?? '—'}
      </p>
      <p style={{ fontSize: '0.8rem', color: C.textDim, letterSpacing: '0.5px' }}>{label}</p>
    </motion.div>
  );
}