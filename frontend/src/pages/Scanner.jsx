import { Lock, Mail, KeyRound, Smartphone, Database, Cloud, Key, ShieldCheck, AlertTriangle, Zap, Shuffle, Save, Loader2, Check, X, Copy, ScanLine, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import Sidebar from '../components/Sidebar';
import RiskMeter from '../components/RiskMeter';
import { scanText, saveScan } from '../services/api';

const SECRET_LABELS = {
  apiKeys: { icon: KeyRound, label: 'API Keys' },
  privateKeys: { icon: Key, label: 'Private Keys' },
  passwords: { icon: Lock, label: 'Passwords' },
  emails: { icon: Mail, label: 'Emails' },
  jwtTokens: { icon: ShieldCheck, label: 'JWT Tokens' },
  phoneNumbers: { icon: Smartphone, label: 'Phone Numbers' },
  mongoURIs: { icon: Database, label: 'MongoDB URIs' },
  awsKeys: { icon: Cloud, label: 'AWS Keys' },
};
const C = {
  green: '#00ff88',bg: '#080c10',bg2: '#0d1117',bg3: '#141b22',border: 'rgba(0,255,136,0.18)',text: '#c9d1d9',textDim: '#8b949e',
  red: '#ff4757',
};

export default function Scanner() {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const fileInputRef = useRef(null);
  const [scannedText, setScannedText] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMasked, setShowMasked] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };
  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 1 * 1024 * 1024) {
    showToast('⚠ File too large (max 1MB)');
    return;
  }
  const reader = new FileReader();
  reader.onload= (event)=>{
    setInputText(event.target.result);
    setFileName(file.name);
    setResult(file.name);
    setShowMasked(false);
   showToast(`✓ Loaded ${file.name}`);
  };
  reader.onerror = () => showToast('✕ Could not read file');
  reader.readAsText(file);
  e.target.value='';//it is for to select same file again
};


  const handleScan = async () => {
    if (!inputText.trim()) return showToast('⚠ Please enter some text to scan');
    setScanning(true);
    setSaved(false);
    try {
      const { data } = await scanText(inputText);
      setResult(data);
      setScannedText(inputText);
    } catch (err) {
      showToast('✕ Scan failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setScanning(false);
    }
  };

  const handleMask = () => {
    if (!result) return showToast('⚠ Run a scan first');
    setShowMasked(true);
    showToast('✓ Data masked successfully');
  };

  const handleSaveClick = async () => {
    if (!result) return showToast('⚠ Run a scan first');
     setShowSaveModal(true); 
  };
  const confirmSave = async(includeOriginal) =>{
    setShowSaveModal(false);
    setSaving(true);
    try {
      await saveScan({
        originalText: includeOriginal ? scannedText: '',
        maskedText: result.maskedText,
        secretsFound: result.detectedSecrets,
        totalSecretsFound: result.totalSecretsFound,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel
      });
      setSaved(true);
      showToast('✓ Scan saved to history');
    } catch (err) {
      showToast('✕ Save failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.maskedText);
    showToast(' Masked text copied to clipboard');
  };

  const totalFound = result?.totalSecretsFound ?? 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');

        @keyframes headingGlow{
          0%,100%{text-shadow:0 0 10px rgba(0,255,136,0.3),0 0 20px rgba(0,255,136,0.15)}
          50%{text-shadow:0 0 20px rgba(0,255,136,0.6),0 0 35px rgba(0,255,136,0.3)}
        }
        .sc-glow-heading{
          color:#00ff88 !important;
          animation:headingGlow 2.5s ease-in-out infinite;
        }
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes cardGlow{
          0%,100%{border-color:rgba(0,255,136,0.25);box-shadow:0 0 15px rgba(0,255,136,0.08)}
          50%{border-color:rgba(0,255,136,0.5);box-shadow:0 0 25px rgba(0,255,136,0.18)}
        }
        .sc-float{animation:float 3s ease-in-out infinite}
        .sc-glow-panel{animation:cardGlow 3s ease-in-out infinite}
        .sc-btn-outline{background:transparent;border:1px solid ${C.border};color:${C.textDim};padding:0.5rem 1.2rem;font-family:'Share Tech Mono',monospace;font-size:0.8rem;cursor:pointer;letter-spacing:1px;transition:all .2s}
        .sc-btn-outline:hover:not(:disabled){border-color:${C.green};color:${C.green};background:rgba(0,255,136,0.05)}
        .sc-btn-outline:disabled{opacity:0.35;cursor:not-allowed}
        .sc-btn-primary{background:${C.green};color:${C.bg};padding:0.5rem 1.5rem;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.9rem;border:none;cursor:pointer;letter-spacing:1px;transition:all .2s;box-shadow:0 0 15px rgba(0,255,136,0.25)}
        .sc-btn-primary:hover:not(:disabled){background:#00cc6a;box-shadow:0 0 25px rgba(0,255,136,0.4)}
        .sc-btn-primary:disabled{opacity:1;background:#1a2b24;color:${C.textDim};box-shadow:none;cursor:not-allowed}
        .sc-clear-btn{background:none;border:none;color:${C.textDim};font-size:0.7rem;cursor:pointer;font-family:'Share Tech Mono',monospace;letter-spacing:1px;transition:color .2s}
        .sc-clear-btn:hover{color:${C.red}}
        .sc-secret-row{display:flex;align-items:center;justify-content:space-between;padding:0.7rem 0.9rem;background:rgba(255,71,87,0.05);border:1px solid rgba(255,71,87,0.15)}
      `}</style>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,136,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.035) 1px,transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0
      }} />
      {/* Glow blobs */}
      <div style={{ position: 'fixed', top: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '20%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%' }}>
        <Sidebar />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50, background: C.bg2, border: `1px solid ${C.border}`, padding: '0.8rem 1.2rem', fontSize: '0.85rem', color: '#fff', fontFamily: "'Share Tech Mono', monospace" }}>
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="sc-glow-heading" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Zap size={26} /> Prompt Scanner</h1>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileUpload}
    accept=".env,.js,.jsx,.ts,.tsx,.json,.py,.yml,.yaml,.txt,.xml,.log"
    style={{ display: 'none' }}
  />
            <button
    onClick={() => fileInputRef.current.click()}
    className="sc-btn-outline"
    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
  >
    <Upload size={14} /> UPLOAD FILE
  </button>
              <button onClick={handleMask} disabled={!result} className="sc-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Shuffle size={14} /> MASK DATA</button>
              <button onClick={handleSaveClick} disabled={!result || saving || saved} className="sc-btn-outline"
                style={{ borderColor: saved ? 'rgba(0,255,136,0.4)' : undefined, color: saved ? C.green : undefined }}>
                  {saving ? <><Loader2 size={14} className="sc-spin" /> SAVING...</> : saved ? <><Check size={14} /> SAVED</> : <><Save size={14} /> SAVE SCAN</>}
              </button>
              <button onClick={handleScan} disabled={scanning} className="sc-btn-primary">
                {scanning ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(8,12,16,0.3)', borderTop: `2px solid ${C.bg}`, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                   SCANNING...
                  </span>
                ) : ' SCAN NOW'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left: Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}` }}>
              <div style={{ padding: '0.6rem 1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bg2 }}>
  <span style={{ fontSize: '0.7rem', color: showMasked ? C.green : C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
    {showMasked && <Check size={13} />} {showMasked ? 'SAFE TO USE — MASKED OUTPUT' :fileName ?`Loaded:${fileName}`:'INPUT — PASTE YOUR CODE OR TEXT'}
  </span>
  <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
  {showMasked && ( <button onClick={handleCopy} style={{ background:'none', border:'1px solid ${C.green}',borderRadius:'4px', fontSize: '0.72rem', color: C.green, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Copy size={13} /> COPY SAFE TEXT</button>
  )}
  <button onClick={() => { setInputText(''); setResult(null); setShowMasked(false); }} className="sc-clear-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><X size={12} /> CLEAR</button>
</div>
</div>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={showMasked && result ? result.maskedText : inputText}
                onChange={(val) => { if (!showMasked) setInputText(val || ''); }}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },lineNumbers: 'on', wordWrap: 'on', padding: { top: 16 }, fontFamily: 'JetBrains Mono, monospace',
                  readOnly: showMasked,scrollBeyondLastLine: false,
                }}
              />
              {showMasked && (
               <div style={{ padding: '0.6rem 1rem', background: 'rgba(0,255,136,0.06)', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: C.green, fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} /> SHOWING MASKED OUTPUT — SAFE TO USE</span>
<div style={{ display: 'flex', gap: '1rem' }}>
  <button onClick={handleCopy} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: C.green, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Copy size={14} /> COPY</button>
  <button onClick={() => setShowMasked(false)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: C.textDim, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace" }}>SHOW ORIGINAL</button>
</div>
                </div>
              )}
            </div>

            {/* Right: Results */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: C.bg2, padding: '1rem', gap: '1rem' }}>
              {!result ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: C.textDim, padding: '3rem 0' }}>
                  <div className="sc-float" style={{ marginBottom: '1rem',display:'flex',justifyContent:'center' }}><ScanLine size={44} color={C.green}/></div>
                  <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.3rem' }}>Ready to scan</p>
                  <p style={{ fontSize: '0.85rem' }}>Paste your text and click "Scan Now"</p>
                </div>
              ) : (
                <>
                  <RiskMeter score={result.riskScore} level={result.riskLevel} />

                  <div className="sc-glow-panel" style={{ background: C.bg3, border: `1px solid ${C.border}`, padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Detection Results</h3>
                      <span style={{
                        fontSize: '0.7rem', padding: '0.2rem 0.6rem', fontFamily: "'Share Tech Mono', monospace",
                        color: totalFound > 0 ? '#ff8a93' : C.green,
                        background: totalFound > 0 ? 'rgba(255,71,87,0.12)' : 'rgba(0,255,136,0.08)',
                        border: `1px solid ${totalFound > 0 ? 'rgba(255,71,87,0.3)' : C.border}`
                      }}>{totalFound} FOUND</span>
                    </div>

                    {totalFound === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}><Check size={32} color={C.green} /></div>
                        <p style={{ color: C.green, fontSize: '0.85rem', fontWeight: 600 }}>No secrets detected</p>
                        <p style={{ color: C.textDim, fontSize: '0.75rem', marginTop: '0.2rem' }}>Your text looks safe to use</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {Object.entries(result.detectedSecrets).map(([key, count]) => {
  if (count === 0) return null;
  const meta = SECRET_LABELS[key];
  const IconComponent = meta ? meta.icon : AlertTriangle;
  const labelText = meta ? meta.label : key;

  return (
    <motion.div key={key} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="sc-secret-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <IconComponent size={16} color="#ff8a93" />
        <span style={{ fontSize: '0.78rem', color: '#ff8a93', fontFamily: "'Share Tech Mono', monospace" }}>{labelText}</span>
      </div>
      <span style={{ fontSize: '0.7rem', background: 'rgba(255,71,87,0.18)', color: '#ff8a93', padding: '0.1rem 0.5rem', fontWeight: 700 }}>{count}</span>
    </motion.div>
  );
})}
                      </div>
                    )}
                  </div>

                  {totalFound > 0 && !showMasked && (
                    <button onClick={handleMask} className="sc-btn-primary" style={{ width: '100%', padding: '0.8rem',display:'inline-flex',alignItems:'center',justifyContent:'center', gap:'6px'}}>
                    <Shuffle size={16} />APPLY MASKING
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '2rem', maxWidth: '420px', textAlign: 'center' }}
            >
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem' }}>
                Save original text too?
              </h3>
              <p style={{ color: C.textDim, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                By default, only the masked (safe) version is saved. Saving the original keeps your unmasked secrets in the database — only do this if you're sure.
              </p>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button onClick={() => confirmSave(false)} className="sc-btn-primary">
                  No, masked only
                </button>
                <button onClick={() => confirmSave(true)} className="sc-btn-outline">
                  Yes, save both
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
};
     