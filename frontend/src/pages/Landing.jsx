import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getPublicActivity } from '../services/api';
import { KeyRound, Lock, Zap, BarChart3, ShieldCheck, FileText, ArrowRight, Check } from 'lucide-react';

const TYPING_WORDS = ['API Keys', 'Passwords', 'JWT Tokens', 'DB Credentials', 'AWS Keys', 'Secrets'];
const DEMO_PATTERNS = {
  'API Key': [/sk[_-](proj[_-])?[a-zA-Z0-9_-]{20,}/g, /AIza[0-9A-Za-z\-_]{35}/g, /sk_live_[0-9a-zA-Z]{24,}/g, /sk_test_[0-9a-zA-Z]{24,}/g],
  'GitHub Token': [/ghp_[a-zA-Z0-9]{36}/g, /gho_[a-zA-Z0-9]{36}/g],
  'Slack Token': [/xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}/g],
  'Private Key': [/-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g],
  'Password': [/password\s*[:=]\s*["']?[^\s"']{4,}["']?/gi],
  'JWT Token': [/eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]*/g],
  'DB URI': [/mongodb(\+srv)?:\/\/[^\s"'`]+/g, /postgres(ql)?:\/\/[^\s"'`]+/g],
  'AWS Key': [/AKIA[0-9A-Z]{16}/g],
};

function demoScan(text) {
  let masked = text;
  const found = [];
  for (const [type, regexList] of Object.entries(DEMO_PATTERNS)) {
    for (const regex of regexList) {
      const matches = text.match(new RegExp(regex.source, regex.flags)) || [];
      matches.forEach(m => {
        found.push({ type, value: m });
        masked = masked.split(m).join(`[${type.toUpperCase().replace(/\s/g, '_')}_MASKED]`);
      });
    }
  }
  return { found, masked };
}

/* ---------- Premium auto-drift particle network background ---------- */
function ParticleNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, particles, animationId;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const COUNT = 130;
const LINK_DIST = 260;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function init() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.7;
            ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        let nearest = null, nearestDist = Infinity;
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < nearestDist) { nearestDist = d; nearest = particles[j]; }
        }
        if (nearest && nearestDist > LINK_DIST) {
          const alpha = Math.max(0.12, 0.4 - nearestDist / 1000);
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(nearest.x, nearest.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,255,136,0.8)';
        ctx.shadowColor = 'rgba(0,255,136,0.9)';
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(step);
    }

    function handleResize() { resize(); init(); }

    resize();
    init();
    step();
    const settleTimer = setTimeout(() => { resize(); init(); }, 150);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(settleTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        zIndex: 0, pointerEvents: 'none', opacity: 1,
      }}
    />
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [demoInput, setDemoInput] = useState('const apiKey = "sk-proj-abc123XYZdef456ghi789jkl";\nconst password = "MySecretPass123";');
  const [demoResult, setDemoResult] = useState(null);
  const [scanning, setScanning] = useState(false);
 const runDemoScan = () => {
  setScanning(true);
  setDemoResult(null);
  setTimeout(() => {
    setDemoResult(demoScan(demoInput));
    setScanning(false);
  }, 600);
};

  const [tickerActivity, setTickerActivity] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await getPublicActivity();
        setTickerActivity(data);
      } catch (err) {
        console.error('Could not load activity feed', err);
      }
    };
    fetchActivity();
  }, []);

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
    { icon: KeyRound, title: 'API Key Detection', desc: 'Instantly detect leaked API keys, tokens, and credentials in your prompts.', tag: 'REGEX + NLP' },
    { icon: Lock, title: 'Smart Masking', desc: 'Automatically replace sensitive data with safe placeholders before sending to AI.', tag: 'ZERO TRUST' },
    { icon: Zap, title: 'Real-Time Scanning', desc: 'Sub-second scanning with detailed risk scoring and threat categorization.', tag: 'HIGH PERFORMANCE' },
    { icon: BarChart3, title: 'Risk Analytics', desc: 'Visual dashboards showing your security posture and scan history.', tag: 'AUDIT READY' },
    { icon: ShieldCheck, title: 'JWT Protection', desc: 'Detect and mask JWT tokens, passwords, and database connection strings.', tag: 'MULTI-PATTERN' },
    { icon: FileText, title: 'Audit History', desc: 'Full scan history with downloadable PDF reports for compliance.', tag: 'COMPLIANCE' },
  ];

  const steps = [
    { n: '01', title: 'Paste Your Prompt', desc: 'Drop any code snippet, prompt, or text into the Monaco editor.', tag: 'EDITOR INPUT' },
    { n: '02', title: 'Scan Instantly', desc: 'Our regex engine scans for 20+ types of sensitive data in milliseconds.', tag: 'DETECTION ENGINE' },
    { n: '03', title: 'Get Masked Output', desc: 'Copy the sanitized version — safe to send to any AI tool.', tag: 'MASKING ENGINE' },
  ];
  const faqs = [
  {  q: 'Is my data stored anywhere?', a: 'The live demo on this page runs entirely in your browser — nothing is sent to a server. Data is only stored if you create an account and save scans to your history.'
  },
  { q: 'Which AI tools does this work with?', a: 'PromptShield works with any AI tool — ChatGPT, Claude, Gemini, or others. Scan and mask your prompt before pasting it anywhere.'
  },
  { q: 'Does it ever produce false positives?', a: "It's a regex-based detection engine, so it may occasionally miss edge cases or flag something incorrectly. Always double-check the masked output before sending."
  },
  { q: 'Is it free to use?',  a: 'Yes, free for individuals. Sign up and start scanning right away.'
  },
];

  const C = {
    green: '#00ff88', greenDim: '#00cc6a', greenGlow: 'rgba(0,255,136,0.15)',
    bg: '#080c10', bg2: '#0d1117', bg3: '#111820',
    border: 'rgba(0,255,136,0.18)', text: '#c9d1d9', textDim: '#8b949e', red: '#ff4757',
  };

  const revealUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const sectionTag = {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: C.green,
    letterSpacing: '2px', marginBottom: '1.2rem',
    border: `1px solid ${C.border}`, padding: '0.35rem 1rem',
    borderRadius: '999px', background: 'rgba(0,255,136,0.05)'
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes spin { from { transform: rotate(0deg); }to { transform: rotate(360deg); }}
        .sc-badge-dot{width:6px;height:6px;background:${C.green};border-radius:50%;animation:blink 1.2s infinite}
        .sc-nav-link{color:${C.textDim};text-decoration:none;font-size:0.85rem;letter-spacing:1px;transition:color 0.2s;cursor:pointer}
        .sc-nav-link:hover{color:${C.green}}
        .sc-btn-primary{background:${C.green};color:${C.bg};padding:0.8rem 2rem;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1rem;border:none;cursor:pointer;letter-spacing:1px;transition:all 0.2s}
        .sc-btn-primary:hover{background:${C.greenDim};transform:translateY(-2px)}
        .sc-btn-secondary{background:transparent;color:${C.green};padding:0.8rem 2rem;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:1rem;border:1px solid ${C.border};cursor:pointer;letter-spacing:1px;transition:all 0.2s}
        .sc-btn-secondary:hover{border-color:${C.green};background:${C.greenGlow}}
        .sc-feature-card{background:${C.bg2};padding:2rem;transition:background 0.2s, transform 0.2s}
        .sc-feature-card:hover{background:${C.bg3};transform:translateY(-4px)}
        .sc-feature-icon{width:42px;height:42px;border:1px solid ${C.border};display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:${C.green};background:rgba(0,255,136,0.05)}
        .sc-flow-step:not(:last-child){position:relative}
        .sc-cursor{animation:blink 0.8s infinite}
        .sc-stat{transition:transform 0.2s}
        .sc-stat:hover{transform:translateY(-3px)}

      `}</style>

      <ParticleNetwork />

      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,12,16,0.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, background: C.green, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,255,136,0.5)' }}>
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
          <button onClick={() => navigate('/signup')} style={{ background: 'transparent', border: `1px solid ${C.green}`, color: C.green, padding: '0.4rem 1.2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '1px' }}
            onMouseEnter={e => e.currentTarget.style.background = C.greenGlow}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            GET ACCESS
          </button>
        </nav>

        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem 4rem' }}>
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${C.border}`, padding: '0.35rem 1rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: C.green, marginBottom: '2rem', letterSpacing: '2px' }}>
              <span className="sc-badge-dot"></span> ACTIVE PROTECTION ENABLED
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              <span style={{ display: 'block', color: '#fff' }}>Stop Leaking</span>
              <span style={{ display: 'block', color: C.green }}>Secrets to AI</span>
              <span style={{ display: 'block', color: C.textDim, fontWeight: 400, fontSize: '0.5em', letterSpacing: '4px', marginTop: '0.5rem', fontFamily: "'Share Tech Mono', monospace" }}>
                AI PROMPT SECURITY GATEWAY
              </span>
            </motion.h1>

            <div style={{ fontSize: '1.1rem', fontFamily: "'Share Tech Mono', monospace", color: C.textDim, marginBottom: '1.5rem', minHeight: '30px' }}>
              Detects <span style={{ color: C.green, borderBottom: `2px solid ${C.green}` }}>{displayed}</span>
              <span className="sc-cursor" style={{ color: C.green }}>|</span> automatically
            </div>

            <p style={{ maxWidth: '560px', margin: '0 auto 2.5rem', color: C.textDim, fontSize: '1rem', lineHeight: 1.7 }}>
              PromptShield sits between your code and any AI — scanning and masking <span style={{ color: C.green }}>API keys, passwords & PII</span> before they ever leave your machine.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <button className="sc-btn-primary" onClick={() => navigate('/signup')}>START SCANNING FREE</button>
              <button className="sc-btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>LEARN MORE ↓</button>
            </div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ background: C.bg2, border: `1px solid ${C.border}`, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', overflow: 'hidden' }}>
                <div style={{ background: C.bg3, padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }}></div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: C.textDim, letterSpacing: '2px' }}>LIVE SCAN DEMO</span>
                </div>
                <div style={{ padding: '1.2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.4rem', color: C.red }}>⚠ RAW PROMPT</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ff8a93', borderLeft: `2px solid ${C.red}`, background: 'rgba(255,71,87,0.12)' }}>const key = "sk-abc123xyz"</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ff8a93', borderLeft: `2px solid ${C.red}`, background: 'rgba(255,71,87,0.12)' }}>password: "admin@1234"</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ff8a93', borderLeft: `2px solid ${C.red}`, background: 'rgba(255,71,87,0.12)' }}>mongodb+srv://user:pass@cluster</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', color: C.green, fontSize: '1.2rem' }}>
                    <ArrowRight size={20} />
                    <div style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>MASK</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> safe</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.4rem', color: C.green }}>✓ SENT TO AI</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: C.green, borderLeft: `2px solid ${C.green}`, background: 'rgba(0,255,136,0.08)' }}>const key = [API_KEY_MASKED]</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: C.green, borderLeft: `2px solid ${C.green}`, background: 'rgba(0,255,136,0.08)' }}>password: [PASSWORD_MASKED]</div>
                    <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: C.green, borderLeft: `2px solid ${C.green}`, background: 'rgba(0,255,136,0.08)' }}>[MONGO_URI_MASKED]</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* LIVE DEMO */}
        <section style={{ padding: '2rem 2rem 5rem', maxWidth: '800px', margin: '0 auto' }}>
          <motion.div {...revealUp} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={sectionTag}><span className="sc-badge-dot"></span>TRY IT YOURSELF</div>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 700, color: '#fff' }}>
              Live Detection Engine — No Signup Needed
            </h3>
            <p style={{ color: C.textDim, fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Paste anything below. This runs PromptShield's actual detection patterns, right in your browser.
            </p>
          </motion.div>

          <motion.div {...revealUp} style={{ background: C.bg2, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ background: C.bg3, padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }}></div>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: C.textDim, letterSpacing: '2px' }}>DEMO.TXT — RUNS IN YOUR BROWSER</span>
            </div>

            <div style={{ padding: '1.2rem' }}>
              <textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="Paste some code, API keys, or a password here..."
                style={{
                  width: '100%', minHeight: '120px', background: C.bg,
                  border: `1px solid ${C.border}`, color: C.text,
                  fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem',
                  padding: '0.8rem', resize: 'vertical', outline: 'none',
                }}
              />
      <button className="sc-btn-primary" onClick={runDemoScan} disabled={scanning} style={{ marginTop: '1rem', width: '100%', opacity: scanning ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
  {scanning ? (
    <>
      <span style={{
        width: 14, height: 14, border: '2px solid rgba(8,12,16,0.3)',
        borderTopColor: '#080c10', borderRadius: '50%',
        animation: 'spin 0.6s linear infinite', display: 'inline-block'
      }}></span>
      SCANNING...
    </>
  ) : 'SCAN FOR SECRETS'}
</button>

              {demoResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem' }}>
                  {demoResult.found.length === 0 ? (
                    <div style={{ color: C.textDim, fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                      No secrets detected. Try pasting an API key or password.
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.7rem', color: C.red, letterSpacing: '1px', marginBottom: '0.6rem' }}>
                        ⚠ {demoResult.found.length} SECRET{demoResult.found.length > 1 ? 'S' : ''} DETECTED
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        {demoResult.found.map((f, i) => (
                          <div key={i} style={{ fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", color: '#ff8a93', background: 'rgba(255,71,87,0.1)', padding: '0.4rem 0.6rem', borderLeft: `2px solid ${C.red}` }}>
                            {f.type}: {f.value.slice(0, 30)}{f.value.length > 30 ? '...' : ''}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: C.green, letterSpacing: '1px', marginBottom: '0.6rem' }}>✓ MASKED OUTPUT</div>
                      <pre style={{ fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", color: C.green, background: 'rgba(0,255,136,0.06)', padding: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: `1px solid ${C.border}` }}>
                        {demoResult.masked}
                      </pre>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        <motion.div {...revealUp} style={{ display: 'flex', justifyContent: 'center', gap: '3rem', padding: '3rem 2rem', flexWrap: 'wrap', borderBottom: `1px solid ${C.border}` }}>
          {[['20+', 'SECRET FORMATS'], ['8', 'CATEGORIES'], ['REGEX', 'BASED ENGINE']].map(([val, label]) => (
            <div key={label} className="sc-stat" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: C.green }}>{val}</div>
              <div style={{ fontSize: '0.75rem', color: C.textDim, letterSpacing: '2px', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        <section id="how" style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div {...revealUp} style={sectionTag}><span className="sc-badge-dot"></span>HOW IT WORKS</motion.div>
          <motion.h2 {...revealUp} transition={{ ...revealUp.transition, delay: 0.1 }} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Zero Trust.<br />Full AI Power.
          </motion.h2>
          <motion.p {...revealUp} transition={{ ...revealUp.transition, delay: 0.15 }} style={{ color: C.textDim, maxWidth: '500px', lineHeight: 1.7, marginBottom: '3rem' }}>
            Every prompt passes through PromptShield's scanner. Your secrets never leave your machine unmasked.
          </motion.p>

          <motion.div {...revealUp} style={{ border: '1px solid rgba(255,71,87,0.3)', background: 'rgba(255,71,87,0.05)', padding: '1.5rem', margin: '0 0 3rem', display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠</div>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: C.red, marginBottom: '0.4rem' }}>Real Incident — Samsung, 2023</div>
              <div style={{ color: C.textDim, fontSize: '0.88rem', lineHeight: 1.6 }}>
                Samsung engineers accidentally leaked confidential source code & internal meeting notes by pasting them into ChatGPT. The incident triggered a company-wide AI ban. PromptShield was built to prevent exactly this.
              </div>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}>
            {steps.map((s, i) => (
              <motion.div key={i} className="sc-flow-step"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
                style={{ display: 'flex', gap: '1.5rem' }}>
                {i !== steps.length - 1 && (
                  <div style={{ position: 'absolute', left: '19px', marginTop: '48px', width: '1px', height: 'calc(100% - 8px)', background: C.border }}></div>
                )}
                <div style={{ width: 38, height: 38, border: `1px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: C.green, flexShrink: 0, background: C.bg }}>{s.n}</div>
                <div style={{ padding: '0 0 2.5rem' }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: '#fff', marginBottom: '0.3rem' }}>{s.title}</div>
                  <div style={{ color: C.textDim, fontSize: '0.88rem', lineHeight: 1.6 }}>{s.desc}</div>
                  <span style={{ display: 'inline-block', background: 'rgba(0,255,136,0.08)', border: `1px solid ${C.border}`, padding: '0.15rem 0.6rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: C.green, marginTop: '0.5rem', letterSpacing: '1px' }}>{s.tag}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="features" style={{ padding: '0 2rem 5rem', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div {...revealUp} style={sectionTag}><span className="sc-badge-dot"></span>FEATURES</motion.div>
          <motion.h2 {...revealUp} transition={{ ...revealUp.transition, delay: 0.1 }} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Built for Real<br />Developer Workflows
          </motion.h2>
          <motion.p {...revealUp} transition={{ ...revealUp.transition, delay: 0.15 }} style={{ color: C.textDim, maxWidth: '500px', lineHeight: 1.7, marginBottom: '3rem' }}>
            Not a blocker — a bridge. Use AI freely without leaking your secrets.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1px', background: C.border, border: `1px solid ${C.border}` }}>
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
    style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>
    Common Questions
  </motion.h2>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: C.border, border: `1px solid ${C.border}` }}>
    {faqs.map((item, i) => (
      <div key={i} style={{ background: C.bg2 }}>
        <button
          onClick={() => setOpenFaq(openFaq === i ? null : i)}
          style={{
            width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            color: '#fff', fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', fontWeight: 600
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

        <motion.div {...revealUp} style={{ textAlign: 'center', padding: '5rem 2rem', borderTop: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Ship Fast.<br />Keep Secrets Private.
          </h2>
          <p style={{ color: C.textDim, marginBottom: '2rem' }}>Join developers who use AI without putting their company at risk.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="sc-btn-primary" onClick={() => navigate('/signup')}>GET STARTED — IT'S FREE</button>
            <button className="sc-btn-secondary" onClick={() => navigate('/login')}>LOGIN</button>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: C.green, marginTop: '1.5rem', opacity: 0.7 }}>scan.prompt.secure — free for individuals</div>
        </motion.div>

        <footer style={{ borderTop: `1px solid ${C.border}`, padding: '2rem', textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: C.textDim }}>
          <span style={{ color: C.green }}>PROMPTSHIELD AI</span> — built by Kanishka &nbsp;|&nbsp; <span style={{ color: C.green }}>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}