import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ShieldAlert, FileText, ArrowRight, Check, Copy, ScanSearch, EyeOff, Gauge, History, Sparkles, Eraser, FlaskConical
}from 'lucide-react';

const TYPING_WORDS = ['API Keys', 'Passwords', 'JWT Tokens', 'DB Credentials', 'AWS Keys', 'Secrets'];
const DEMO_PATTERNS = {
  'API Key': { regex: [/sk[_-](proj[_-])?[a-zA-Z0-9_-]{20,}/g, /AIza[0-9A-Za-z\-_]{35}/g, /sk_live_[0-9a-zA-Z]{24,}/g, /sk_test_[0-9a-zA-Z]{24,}/g], weight: 40 },
  'GitHub Token': { regex: [/ghp_[a-zA-Z0-9]{36}/g, /gho_[a-zA-Z0-9]{36}/g], weight: 40 },
  'Slack Token': { regex: [/xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}/g], weight: 40 },
  'Private Key': { regex: [/-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g], weight: 40 },
  'Password': { regex: [/password\s*[:=]\s*["']?[^\s"']{4,}["']?/gi], weight: 30 },
  'JWT Token': { regex: [/eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]*/g], weight: 50 },
  'DB URI': { regex: [/mongodb(\+srv)?:\/\/[^\s"'`]+/g, /postgres(ql)?:\/\/[^\s"'`]+/g], weight: 50 },
  'AWS Key': { regex: [/AKIA[0-9A-Z]{16}/g], weight: 40 },
};

function demoScan(text) {
  let masked = text;
  const found = [];
  let score = 0;
  for (const [type, { regex: regexList, weight }] of Object.entries(DEMO_PATTERNS)) {
    for (const regex of regexList) {
      const matches = text.match(new RegExp(regex.source, regex.flags)) || [];
      matches.forEach((m, idx) => {
        const placeholder = `[${type.toUpperCase().replace(/\s/g, '_')}_MASKED${matches.length > 1 ? `_${idx + 1}` : ''}]`;
        found.push({ type, value: m, placeholder });
        masked = masked.split(m).join(placeholder);
        score += weight;
      });
    }
  }
  score = Math.min(score, 100);
  const riskLevel = score === 0 ? 'NONE' : score >= 70 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';
  return { found, masked, score, riskLevel };
}

/* ---------- Premium auto-drift particle network background ---------- */
function ParticleNetwork() {
  const canvasRef = useRef(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, particles, animationId;
    const mouse = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 130;
 
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * DPR;canvas.height = h * DPR;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(120, Math.floor((w * h) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,   y: Math.random() * h,   vx: (Math.random() - 0.5) * 0.35,   vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 3 + 2,
      }));
    }
 
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((120 - d) / 120) * 0.6;
          p.x += (dx / d) * f;p.y += (dy / d) * f;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.28;
            ctx.strokeStyle = `rgba(0,255,157,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        const near = Math.abs(p.x - mouse.x) < 140 && Math.abs(p.y - mouse.y) < 140;
        ctx.fillStyle = near ? 'rgba(92,232,255,0.95)' : 'rgba(0,255,157,0.75)';ctx.beginPath();ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(tick);
    }
 
    function onMove(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }
 
    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
 
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseout', onLeave);
    };
  }, []);
 return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.7 }} />;
}
 

function HighlightedMasked({ text, green }) {
  const parts = text.split(/(\[[A-Z0-9_]+_MASKED(?:_\d+)?\])/g);
  return parts.map((p, i) =>
    /^\[[A-Z0-9_]+_MASKED/.test(p) ? (
      <span key={i} style={{ background: 'rgba(0,255,157,0.15)', color: green, padding: '0.05rem 0.3rem', borderRadius: '4px', textShadow: '0 0 12px rgba(0,255,157,0.35)' }}>
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

function RiskBadge({ level, C }) {
  const map = {
    HIGH: { color: C.red, bg: 'rgba(255,77,109,0.15)', border: C.red },
    MEDIUM: { color: '#febc2e', bg: 'rgba(254,188,46,0.15)', border: '#febc2e' },
    LOW: { color: C.green, bg: 'rgba(0,255,157,0.15)', border: C.green },
  };
  const s = map[level] || map.LOW;
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", fontWeight: 700, letterSpacing: '0.5px' }}>
      ● {level}
    </span>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const DEFAULT_TEXT = 'const apiKey = "sk-proj-abc123XYZdef456ghi789jkl";\nconst password = "MySecretPass123";';
  const [demoInput, setDemoInput] = useState(DEFAULT_TEXT);
  const [demoResult, setDemoResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => demoInput.split('\n').length, [demoInput]);

  const runDemoScan = () => {
    setScanning(true);
    setDemoResult(null);
    setTimeout(() => {
      setDemoResult(demoScan(demoInput));
      setScanning(false);
    }, 650);
  };

  const copyMasked = async () => {
    if (!demoResult) return;
    await navigator.clipboard.writeText(demoResult.masked);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const [wordIndex, setWordIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    let timeout;
    if (typing) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 1500);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setWordIndex((wordIndex + 1) % TYPING_WORDS.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, wordIndex]);

  const features = [
    { icon: ScanSearch, title: '20+ Secret Detectors', desc: 'OpenAI & Anthropic keys, AWS creds, GitHub/Slack/Stripe tokens, JWTs, private key blocks, DB URIs, hardcoded passwords, PII and more.', tag: 'DETECTION' },
    { icon: EyeOff, title: 'Instant Masking', desc: 'Every hit is swapped for a readable placeholder like [JWT_MASKED], so your prompt stays useful — and harmless.', tag: 'MASKING' },
    { icon: Gauge, title: 'Weighted Risk Scoring', desc: 'JWT or MongoDB URI? +50. API key? +40. Password? +30. Get a Low / Medium / High verdict with a 0–100 score.', tag: 'SCORING' },
    { icon: History, title: 'Scan History', desc: 'Every scan is archived with its findings. Re-open any scan to compare original vs masked side-by-side.', tag: 'AUDIT' },
    { icon: FileText, title: 'PDF & CSV Reports', desc: 'Export compliance-ready PDF reports per scan, or dump your entire history to CSV for audits.', tag: 'REPORTS' },
    { icon: Lock, title: 'Private by Design', desc: 'The landing demo runs 100% client-side. Saved scans live under your JWT-protected account — deletable at any time.', tag: 'SECURITY' },
  ];

  const steps = [
    { n: '01', title: 'Paste your prompt', desc: "Code, configs, logs — anything you're about to send to an LLM." },
    { n: '02', title: 'We scan & score', desc: '20+ regex detectors sweep for secrets and weight the risk in under a millisecond.' },
    { n: '03', title: 'Copy the safe copy', desc: 'Secrets become [MASKED] placeholders. Paste it anywhere with zero exposure.' },
  ];

  const faqs = [
    { q: 'what exactly does PromptShield detect?', a: 'Over 20 secret formats: OpenAI, Anthropic, Google, Stripe, SendGrid and npm keys, GitHub & Slack tokens, AWS credentials, JWTs, RSA/EC/OpenSSH private key blocks, MongoDB/Postgres/MySQL/Redis connection URIs, generic KEY/TOKEN/SECRET env assignments, hardcoded passwords, plus emails and phone numbers.' },
    { q: 'Does the Demo send my text to server?', a: 'No. The landing-page demo runs the detection engine entirely in your browser using plain regex — zero network calls. Only when you explicitly press "Save to History" inside the dashboard does the scan get stored under your account.' },
    { q: 'Is my data stored anywhere?', a: 'The live demo on this page runs entirely in your browser — nothing is sent to a server. Data is only stored if you create an account and save scans to your history.' },
    { q: 'Which AI tools does this work with?', a: 'PromptShield works with any AI tool — ChatGPT, Claude, Gemini, or others. Scan and mask your prompt before pasting it anywhere.' },
    { q: 'Does it ever produce false positives?', a: "It's a regex-based detection engine, so it may occasionally miss edge cases or flag something incorrectly. Always double-check the masked output before sending." },
    { q: 'Is it free to use?', a: 'Yes, free for individuals. Sign up and start scanning right away.' },
  ];

  const C = {
    green: '#00ff9d', greenDim: '#00cc7d', greenGlow: 'rgba(0,255,157,0.15)', ice: '#020404',
    bg: '#020806', bg2: '#05130c', bg3: '#071a10',
    border: 'rgba(0,255,157,0.18)', text: '#dff0e8', textDim: '#9fb8ac', red: '#ff4d6d',
  };

  const revealUp = {
    initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 }, transition: { duration: 0.6, ease: 'easeOut' },
  };

  const sectionTag = {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: C.green, letterSpacing: '2px', marginBottom: '1.2rem',
    border: `1px solid ${C.border}`, padding: '0.35rem 1rem', borderRadius: '999px', background: 'rgba(0,255,157,0.05)',
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: `radial-gradient(ellipse at top, rgba(0,255,157,0.08), transparent 60%), linear-gradient(180deg, #020806 0%, #050f0a 50%, #020806 100%)`, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&family=Russo+One&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes shineSweep { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanSweepY { 0% { top: -15%; } 100% { top: 110%; } }
        .sc-shine-text {
          background: linear-gradient(90deg, #00ff9d 0%, #00ff9d 40%, #ffffff 50%, #00ff9d 60%, #00ff9d 100%); background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shineSweep 3s linear infinite;
        }
        .demo-scan-sweep {
          position: absolute; inset-inline: 0; height: 56px; pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(0,255,157,0.25), transparent);
          animation: scanSweepY 0.65s linear;
        }
        .demo-tag {
          display: inline-flex; align-items: center; gap: 4px; padding: 0.3rem 0.7rem; font-size: 0.7rem;
          font-family: 'Share Tech Mono', monospace; border: 1px solid rgba(255,77,109,0.4); background: rgba(255,77,109,0.1); color: #ff8fa3; border-radius: 5px;
        }
        .sc-badge-dot{width:6px;height:6px;background:${C.green};border-radius:50%;animation:blink 1.2s infinite}
        .sc-nav-link{color:${C.textDim};text-decoration:none;font-size:0.85rem;letter-spacing:1px;transition:color 0.2s;cursor:pointer}
        .sc-nav-link:hover{color:${C.green}}
        .sc-btn-primary{
          background:${C.green};color:${C.bg};padding:0.8rem 1.8rem; font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1rem;
          border:none;border-radius:999px;cursor:pointer;letter-spacing:0.5px; transition:all 0.25s;display:inline-flex;align-items:center;gap:0.5rem; box-shadow:0 0 20px rgba(0,255,157,0.35);
        }
        .sc-btn-primary:hover{ background:#33ffb0;transform:translateY(-2px); box-shadow:0 0 30px rgba(0,255,157,0.6); }
        .sc-btn-primary:disabled{ opacity:0.6; cursor:default; transform:none; }
        .sc-btn-secondary{
          background:rgba(0,255,157,0.06);color:${C.green};padding:0.8rem 1.8rem; font-family:'Rajdhani',sans-serif;font-weight:600;font-size:1rem;
          border:1px solid ${C.border};border-radius:999px;cursor:pointer; letter-spacing:0.5px;transition:all 0.25s; display:inline-flex;align-items:center;gap:0.5rem;
        }
        .sc-btn-secondary:hover{ border-color:${C.green};background:rgba(0,255,157,0.14); transform:translateY(-2px); }
        .sc-btn-small{
          background:rgba(0,255,157,0.06);color:${C.green};padding:0.45rem 0.9rem; font-family:'Rajdhani',sans-serif;font-weight:600;font-size:0.8rem;
          border:1px solid ${C.border};border-radius:999px;cursor:pointer; letter-spacing:0.3px;transition:all 0.2s; display:inline-flex;align-items:center;gap:0.4rem;
        }
        .sc-btn-small:hover{ border-color:${C.green};background:rgba(0,255,157,0.14); }
        .sc-btn-small-ghost{
          background:transparent;color:${C.textDim};padding:0.45rem 0.9rem; font-family:'Rajdhani',sans-serif;font-weight:600;font-size:0.8rem;
          border:1px solid rgba(159,184,172,0.25);border-radius:999px;cursor:pointer; letter-spacing:0.3px;transition:all 0.2s; display:inline-flex;align-items:center;gap:0.4rem;
        }
        .sc-btn-small-ghost:hover{ border-color:rgba(159,184,172,0.5); }
        .sc-feature-card{
          background:linear-gradient(145deg, rgba(0,255,157,0.05), ${C.bg2} 60%);padding:2rem;border-radius:12px; border:1px solid rgba(0,255,157,0.35); box-shadow:0 0 15px rgba(0,255,157,0.1), inset 0 0 15px rgba(0,255,157,0.03);
          transition:all 0.25s;
        }
        .sc-feature-card:hover{
          background:linear-gradient(145deg, rgba(0,255,157,0.09), ${C.bg2} 60%); border-color:${C.green}; box-shadow:0 0 30px rgba(0,255,157,0.25), inset 0 0 20px rgba(0,255,157,0.06); transform:translateY(-4px);
        }
        .sc-feature-icon{width:42px;height:42px;border:1px solid ${C.border};display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:${C.green};background:rgba(0,255,157,0.05)}
        .sc-step-card{ background:${C.bg2};border:1px solid ${C.border};border-radius:14px; padding:2rem 1.7rem;transition:all 0.25s; }
        .sc-step-card:hover{border-color:${C.green};box-shadow:0 0 30px rgba(0,255,157,0.12);transform:translateY(-4px)}
        .sc-step-badge{
          width:52px;height:52px;border-radius:14px;border:1px solid ${C.green};
          display:flex;align-items:center;justify-content:center;margin-bottom:1.2rem;
          font-family:'Share Tech Mono',monospace;font-weight:700;font-size:1.1rem;color:${C.green}; box-shadow:0 0 18px rgba(0,255,157,0.25);background:rgba(0,255,157,0.06);
        }
        .sc-cursor{animation:blink 0.8s infinite}
        .sc-stat{transition:transform 0.2s}
        .sc-stat:hover{transform:translateY(-3px)}
        .sc-line-nums{ scrollbar-width:none; }
        .sc-line-nums::-webkit-scrollbar{ display:none; }
        .demo-grid { display:grid; grid-template-columns: 1fr; }
        @media (min-width: 900px) { .demo-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <ParticleNetwork />

      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(2,8,6,0.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, background: C.green, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,255,157,0.5)' }}>
              <ShieldCheck size={18} color={C.bg} strokeWidth={2.4} />
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              <span style={{ color: '#fff' }}>Prompt</span><span style={{ color: C.green }}>Shield</span>
            </div>
          </div>
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><a href="#how" className="sc-nav-link">HOW IT WORKS</a></li>
            <li><a href="#features" className="sc-nav-link">FEATURES</a></li>
            <li><span onClick={() => navigate('/login')} className="sc-nav-link">LOGIN</span></li>
          </ul>
          <button onClick={() => navigate('/signup')} style={{ background: 'transparent', border: `1px solid ${C.green}`, color: C.green, padding: '0.4rem 1.2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '1px', borderRadius: '999px' }}
            onMouseEnter={e => e.currentTarget.style.background = C.greenGlow}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            GET ACCESS
          </button>
        </nav>

        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem 4rem' }}>
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${C.border}`, padding: '0.35rem 1rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: C.green, marginBottom: '2rem', letterSpacing: '2px', borderRadius: '999px' }}>
              <span className="sc-badge-dot"></span> ACTIVE PROTECTION ENABLED
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight:700, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              <span style={{ display: 'block', color: '#fff' }}>Never leak a secret to</span>
              <span className="sc-shine-text" style={{ display: 'block', position: 'relative' }}>an AI again</span>
            </motion.h1>
            <div style={{ fontSize: '1.1rem', fontFamily: "'Share Tech Mono', monospace", color: C.textDim, marginBottom: '1.5rem', minHeight: '30px' }}>
              Detects <span style={{ color: C.green, borderBottom: `2px solid ${C.green}` }}>{displayed}</span>
              <span className="sc-cursor" style={{ color: C.green }}>|</span> automatically
            </div>
            <p style={{ maxWidth: '560px', margin: '0 auto 2.5rem', color: C.textDim, fontSize: '1rem', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
  PromptShield sits between your code and any AI — scanning and masking <span style={{ color: C.green }}>API keys, passwords & PII</span> before they ever leave your machine.
</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', color: C.textDim, fontSize: '0.85rem', fontFamily: "'Share Tech Mono', monospace" }}>
  <Lock size={14} color={C.green} /> Your data stays private — nothing is sent anywhere without your consent
</div>
                        
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <button className="sc-btn-secondary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                <ScanSearch size={16} /> Try the Live Demo
              </button>
              <button className="sc-btn-primary" onClick={() => navigate('/signup')}>
                <ShieldCheck size={16} /> Arm your account
              </button>
            </div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ background: C.bg2, border: `1px solid ${C.border}`, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', overflow: 'hidden', borderRadius: '10px' }}>
                <div style={{ background: C.bg3, padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }}></div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: C.textDim, letterSpacing: '2px' }}>LIVE SCAN DEMO</span>
                </div>
                <div style={{ padding: '1.2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.4rem', color: C.red }}>⚠ RAW PROMPT</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ff8fa3', borderLeft: `2px solid ${C.red}`, background: 'rgba(255,77,109,0.12)' }}>const key = "sk-abc123xyz"</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ff8fa3', borderLeft: `2px solid ${C.red}`, background: 'rgba(255,77,109,0.12)' }}>password: "admin@1234"</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ff8fa3', borderLeft: `2px solid ${C.red}`, background: 'rgba(255,77,109,0.12)' }}>mongodb+srv://user:pass@cluster</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', color: C.green, fontSize: '1.2rem' }}>
                    <ArrowRight size={20} />
                    <div style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>MASK</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> safe</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.4rem', color: C.green }}>✓ SENT TO AI</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: C.green, borderLeft: `2px solid ${C.green}`, background: 'rgba(0,255,157,0.08)' }}>const key = [API_KEY_MASKED]</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: C.green, borderLeft: `2px solid ${C.green}`, background: 'rgba(0,255,157,0.08)' }}>password: [PASSWORD_MASKED]</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: C.green, borderLeft: `2px solid ${C.green}`, background: 'rgba(0,255,157,0.08)' }}>[MONGO_URI_MASKED]</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="demo" style={{ padding: '2rem 2rem 5rem', maxWidth: '1000px', margin: '0 auto', scrollMarginTop: '90px' }}>
          <motion.div {...revealUp} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={sectionTag}><span className="sc-badge-dot"></span>LIVE DEMO — NO ACCOUNT NEEDED</div>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>
              LIVE ENGINE <span style={{ color: C.green }}>TEST IT FREE</span>
            </h3>
            <p style={{ color: C.textDim, fontSize: '0.95rem', marginTop: '0.8rem', maxWidth: '560px', margin: '0.8rem auto 0', lineHeight: 1.6 }}>
              This is the real detection engine, running locally in your browser right now. Paste your own config, logs or code — nothing is sent anywhere.
            </p>
          </motion.div>

          <motion.div {...revealUp} style={{ background: '#010403', border: `1px solid ${C.border}`, overflow: 'hidden', position: 'relative', borderRadius: '14px', boxShadow: '0 0 40px rgba(0,255,157,0.06)' }}>
            {/* window chrome */}
            <div style={{ background: C.bg3, padding: '0.7rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }}></div>
              <span style={{ marginLeft: '0.8rem', fontSize: '0.75rem', color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>
                promptshield://live-demo — nothing leaves your browser
              </span>
            </div>

            <div className="demo-grid">
              {/* INPUT PANE */}
              <div style={{ borderRight: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, padding: '0.6rem 1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1.5px', color: C.textDim, textTransform: 'uppercase' }}>
                    <FlaskConical size={14} color={C.ice} /> Untrusted input
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(159,184,172,0.7)' }}>
                    {demoInput.length} chars · {lines} lines
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <div className="sc-line-nums" style={{
                    position: 'absolute', left: 0, top: 0, height: '100%', width: 36, pointerEvents: 'none',
                    borderRight: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.2)', paddingTop: '0.75rem',
                    textAlign: 'right', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', lineHeight: 1.55, color: 'rgba(159,184,172,0.4)'
                  }}>
                    {Array.from({ length: Math.min(lines, 40) }, (_, i) => <div key={i} style={{ paddingRight: '0.5rem' }}>{i + 1}</div>)}
                  </div>
                  <textarea
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    spellCheck={false}
                    style={{
                      width: '100%', height: 300, background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                      color: 'rgba(223,240,232,0.9)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem', lineHeight: 1.55,
                      padding: '0.75rem 1rem 0.75rem 3rem',
                    }}
                  />
                  {scanning && <div className="demo-scan-sweep"></div>}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', borderTop: `1px solid ${C.border}`, padding: '0.8rem 1rem' }}>
                  <button onClick={runDemoScan} disabled={scanning} className="sc-btn-small" style={{ background: C.green, color: C.bg, border: 'none', boxShadow: '0 0 14px rgba(0,255,157,0.3)' }}>
                    {scanning ? (
                      <>
                        <span style={{ width: 12, height: 12, border: '2px solid rgba(2,8,6,0.3)', borderTopColor: C.bg, borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }}></span>
                        Scanning…
                      </>
                    ) : (<><ScanSearch size={14} /> Scan & Mask</>)}
                  </button>
                  <button className="sc-btn-small" onClick={() => { setDemoInput(DEFAULT_TEXT); setDemoResult(null); }}>
                    <Sparkles size={14} /> Load sample
                  </button>
                  <button className="sc-btn-small-ghost" onClick={() => { setDemoInput(''); setDemoResult(null); }}>
                    <Eraser size={14} /> Clear
                  </button>
                </div>
              </div>

              {/* OUTPUT PANE */}
              <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, padding: '0.6rem 1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1.5px', color: C.textDim, textTransform: 'uppercase' }}>
                    {demoResult && demoResult.found.length > 0 ? (
                      <><ShieldAlert size={14} color={C.red} /> Neutralized output</>
                    ) : (
                      <><ShieldCheck size={14} color={C.green} /> Safe output</>
                    )}
                  </span>
                  <AnimatePresence>
                    {demoResult && (
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {demoResult.found.length > 0 && <RiskBadge level={demoResult.riskLevel} C={C} />}
                        {demoResult.found.length > 0 && (
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: C.textDim }}>score {demoResult.score}/100</span>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ position: 'relative', overflowY: 'auto', height: 300, padding: '0.75rem 1rem' }}>
                  {!demoResult && !scanning && (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', textAlign: 'center' }}>
                      <ScanSearch size={32} style={{ opacity: 0.3, color: C.textDim }} />
                      <p style={{ maxWidth: 260, fontSize: '0.75rem', lineHeight: 1.6, color: 'rgba(159,184,172,0.7)' }}>
                        Press <span style={{ color: C.green }}>Scan &amp; Mask</span> — 20+ detectors will sweep this text for keys, tokens, passwords and PII entirely in your browser.
                      </p>
                    </div>
                  )}
                  {scanning && (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                      <div style={{ width: 32, height: 32, border: `2px solid ${C.border}`, borderTopColor: C.green, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}></div>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'rgba(0,255,157,0.8)' }}>sweeping 20+ detectors…</p>
                    </div>
                  )}
                  {demoResult && (
                    <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem', lineHeight: 1.55, color: 'rgba(223,240,232,0.8)', margin: 0 }}>
                      <HighlightedMasked text={demoResult.masked} green={C.green} />
                    </motion.pre>
                  )}
                </div>

                {/* findings strip */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', minHeight: 52, borderTop: `1px solid ${C.border}`, padding: '0.6rem 1rem' }}>
                  {demoResult && demoResult.found.length > 0 ? (
                    <>
                      {demoResult.found.slice(0, 4).map((f, i) => (
                        <span key={i} className="demo-tag">{f.placeholder}</span>
                      ))}
                      {demoResult.found.length > 4 && (
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: C.textDim }}>+{demoResult.found.length - 4} more</span>
                      )}
                      <button onClick={copyMasked} className="sc-btn-small" style={{ marginLeft: 'auto', background: C.green, color: C.bg, border: 'none' }}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy safe text'}
                      </button>
                    </>
                  ) : demoResult ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: C.green }}>
                      <ShieldCheck size={16} /> No secrets detected — this text is safe to paste.
                    </span>
                  ) : (
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(159,184,172,0.6)' }}>findings will appear here…</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.div {...revealUp} style={{ display: 'flex', justifyContent: 'center', gap: '3rem', padding: '3rem 2rem', flexWrap: 'wrap', borderBottom: `1px solid ${C.border}` }}>
          {[['20+', 'SECRET FORMATS'], ['8', 'CATEGORIES'], ['REGEX', 'BASED ENGINE']].map(([val, label]) => (
            <div key={label} className="sc-stat" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: C.green }}>{val}</div>
              <div style={{ fontSize: '0.75rem', color: C.textDim, letterSpacing: '2px', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </motion.div>
        <section id="how" style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div {...revealUp} style={{ textAlign: 'center' }}>
            <div style={{ ...sectionTag, margin: '0 auto 1.2rem' }}><span className="sc-badge-dot"></span>PROTOCOL</div>
          </motion.div>
          <motion.h2 {...revealUp} transition={{ ...revealUp.transition, delay: 0.1 }}
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(2.2rem,4vw,3rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem', textAlign: 'center' }}>
            Three moves to <span className="sc-shine-text">zero leaks</span>
          </motion.h2>
          
          <motion.div {...revealUp} style={{ border: '1px solid rgba(255,77,109,0.3)', background: 'rgba(255,77,109,0.05)', padding: '1.5rem', margin: '2.5rem 0', display: 'flex', gap: '1rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠</div>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, color: C.red, marginBottom: '0.4rem' }}>Real Incident — Samsung, 2023</div>
              <div style={{ color: C.textDim, fontSize: '0.88rem', lineHeight: 1.6 }}>
                Samsung engineers accidentally leaked confidential source code & internal meeting notes by pasting them into ChatGPT. The incident triggered a company-wide AI ban. PromptShield was built to prevent exactly this.
              </div>
            </div>
          </motion.div>


          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem' }}>
            {steps.map((s, i) => (
              <motion.div key={i} className="sc-step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}>
                <div className="sc-step-badge">{s.n}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ color: C.textDim, fontSize: '0.88rem', lineHeight: 1.6 }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>
      
        <section id="features" style={{ padding: '0 2rem 5rem', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div {...revealUp} style={sectionTag}><span className="sc-badge-dot"></span>FEATURES</motion.div>
          <motion.h2 {...revealUp} transition={{ ...revealUp.transition, delay: 0.1 }} style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Security That<br /> <span className="sc-shine-text">Doesn't Get in Your Way</span>
          </motion.h2>
          <motion.p {...revealUp} transition={{ ...revealUp.transition, delay: 0.15 }} style={{ color: C.textDim, maxWidth: '500px', lineHeight: 1.7, marginBottom: '3rem' }}>
            Not a blocker — a bridge. Use AI freely without leaking your secrets.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} className="sc-feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: 'easeOut' }}>
                  <div className="sc-feature-icon"><Icon size={20} strokeWidth={1.8} /></div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>{f.title}</div>
                  <div style={{ color: C.textDim, fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</div>
                  <div style={{ display: 'inline-block', marginTop: '0.8rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: C.green, letterSpacing: '1px' }}>{f.tag}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '2rem 2rem 5rem', maxWidth: '700px', margin: '0 auto' }}>
          <motion.div {...revealUp} style={sectionTag}><span className="sc-badge-dot"></span>FAQ</motion.div>
          <motion.h2 {...revealUp} transition={{ ...revealUp.transition, delay: 0.1 }}
            style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>
            Common  <span className="sc-shine-text">Question</span>
          </motion.h2>
          

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: C.border, border: `1px solid ${C.border}` }}>
            {faqs.map((item, i) => (
              <div key={i} style={{ background: C.bg2 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    color: '#fff', fontFamily: "'Rajdhani',sans-serif", fontSize: '1rem', fontWeight: 600
                  }}>
                  {item.q}
                  <span style={{ color: C.green, fontSize: '1.2rem', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.2rem 1.2rem', color: C.textDim, fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '2rem 2rem 5rem', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div {...revealUp} style={{
            textAlign: 'center', padding: '4rem 2rem', border: `1px solid ${C.border}`, borderRadius: '24px', background: 'rgba(0,255,157,0.02)', boxShadow: '0 0 40px rgba(0,255,157,0.08), inset 0 0 30px rgba(0,255,157,0.02)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              width: 56, height: 56, margin: '0 auto 1.5rem', border: `1.5px solid ${C.green}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,255,157,0.35)'
            }}>
              <ShieldCheck size={26} color={C.green} strokeWidth={1.8} />
            </div>

            <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 'clamp(1.8rem,4.5vw,3rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
              Scan Before <span style={{ color: C.green, textShadow: '0 0 20px rgba(0,255,157,0.6)' }}>you Send</span>
            </h2>

            <p style={{ color: C.textDim, marginBottom: '2rem', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Create a free account to save scans, track risk over time and export audit-ready reports.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '0.7rem', marginTop: '-1rem', marginBottom: '2rem', maxWidth: '380px', margin: '-1rem auto 2rem' }}>
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: C.textDim, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
    <Lock size={14} color={C.green} /> No credit card required </span>
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: C.textDim, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
    <ShieldCheck size={14} color={C.green} /> Your data is never shared with third parties </span>
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: C.textDim, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
    <EyeOff size={14} color={C.green} /> Delete your data anytime, no questions asked  </span>
</div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="sc-btn-primary" onClick={() => navigate('/signup')}>
                <ShieldCheck size={16} /> Create free account
              </button>
              <button className="sc-btn-secondary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                Test the engine again
              </button>
            </div>
          </motion.div>
        </section>

        <footer style={{ borderTop: `1px solid ${C.border}`, padding: '2rem', textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.95rem', color: C.textDim }}>
          <span style={{ color: C.green }}>PROMPTSHIELD AI</span> — built by Kanishka &nbsp;|&nbsp; <span style={{ color: C.green }}>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}