import { motion } from 'framer-motion';

const C = {
  green: '#00ff88',
  bg2: '#0d1117',
  bg3: '#111820',
  border: 'rgba(0,255,136,0.18)',
  textDim: '#8b949e',
};

export default function RiskMeter({ score = 0, level = 'Low' }) {
  const color = level === 'High' ? '#ff4757' : level === 'Medium' ? '#ffb020' : '#00ff88';
  const pct = Math.min(score, 100);

  return (
    <div style={{ background: C.bg3, border: `1px solid ${C.border}`, padding: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: C.green, letterSpacing: '1px' }}>// RISK METER</h3>
        <span style={{
          padding: '0.2rem 0.7rem', fontSize: '0.7rem', fontWeight: 700,
          fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px',
          background: `${color}1a`, color, border: `1px solid ${color}55`
        }}>
          {level?.toUpperCase()} RISK
        </span>
      </div>

      <div style={{ position: 'relative', height: '10px', background: '#080c10', border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: '0.8rem' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, #00ff88, ${color})`, boxShadow: `0 0 10px ${color}66` }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px', marginBottom: '0.6rem' }}>
        <span>0 — SAFE</span><span>50 — MEDIUM</span><span>100 — CRITICAL</span>
      </div>

      <p style={{ textAlign: 'center', fontFamily: "'Rajdhani', sans-serif", fontSize: '1.7rem', fontWeight: 700, color }}>{score}/100</p>
    </div>
  );
}
