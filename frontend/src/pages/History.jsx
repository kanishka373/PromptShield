import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { getHistory, deleteScan } from '../services/api';
import { History as HistoryIcon, Eye, Trash2, Loader2, X, Copy, Check } from 'lucide-react';

const C = {
  green: '#00ff88', bg: '#080c10', bg2: '#0d1117', bg3: '#141b22',border: 'rgba(0,255,136,0.18)',text: '#c9d1d9',textDim: '#8b949e',
};

const getRiskColors = (level) => {
  const map = {
    High: { color: '#ff8a93', bg: 'rgba(255,71,87,0.12)', border: 'rgba(255,71,87,0.3)', bar: '#ff4757' },
    Medium: { color: '#ffcf7a', bg: 'rgba(255,176,32,0.12)', border: 'rgba(255,176,32,0.3)', bar: '#ffb020' },
    Low: { color: C.green, bg: 'rgba(0,255,136,0.08)', border: C.border, bar: C.green },
  };
  return map[level] || map.Low;
};

export default function History() {
  const [scans, setScans] = useState([]);
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewScan, setViewScan] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getHistory();
        setScans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteScan(id);
      setScans(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };
  const handleCopyText =(text,which)=>{
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(()=> setCopied(''),2000);
  };
  const monthOptions = [...new Set(scans.map(s => new Date(s.createdAt).toISOString().slice(0, 7)))]
  .sort()
  .reverse();

const formatMonthLabel = (monthStr) => {
  const [year, month] = monthStr.split('-');
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};
  const filteredScans = filterMonth
  ? scans.filter(s => new Date(s.createdAt).toISOString().slice(0, 7) === filterMonth)
  : scans;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
      @keyframes headingGlow{
  0%,100%{text-shadow:0 0 10px rgba(0,255,136,0.3),0 0 20px rgba(0,255,136,0.15)}
  50%{text-shadow:0 0 20px rgba(0,255,136,0.6),0 0 35px rgba(0,255,136,0.3)}
}
.sc-glow-heading{
  color:#00ff88 !important;
  animation:headingGlow 2.5s ease-in-out infinite;
}
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes cardGlow{
          0%,100%{border-color:rgba(0,255,136,0.25);box-shadow:0 0 15px rgba(0,255,136,0.08)}
          50%{border-color:rgba(0,255,136,0.5);box-shadow:0 0 25px rgba(0,255,136,0.18)}
        }
        .sc-glow-panel{animation:cardGlow 3s ease-in-out infinite}
        .sc-hist-table th{color:${C.green};font-family:'Share Tech Mono',monospace;font-size:0.7rem;letter-spacing:2px;text-align:left;padding:1rem 1.2rem;border-bottom:2px solid ${C.green};background:rgba(0,255,136,0.04)}
        .sc-hist-table td{padding:0.9rem 1.2rem;border-bottom:1px solid rgba(0,255,136,0.08);font-size:0.85rem}
        .sc-hist-table tr{transition:background:0.2s}
        .sc-hist-table tr:hover td{background:rgba(0,255,136,0.05)}
       .sc-action-btn{padding:0.4rem 0.9rem;font-size:0.7rem;font-family:'Share Tech Mono',monospace;letter-spacing:0.5px;cursor:pointer;transition:all .2s;background:transparent;border-radius:999px;font-weight:700}
.sc-view-btn{color:${C.green};border:1px solid ${C.green};box-shadow:0 0 8px rgba(0,255,136,0.15)}
.sc-view-btn:hover{background:rgba(0,255,136,0.12);box-shadow:0 0 18px rgba(0,255,136,0.5);transform:translateY(-1px)}
.sc-delete-btn{color:#ff4757;border:1px solid #ff4757;box-shadow:0 0 8px rgba(255,71,87,0.15)}
.sc-delete-btn:hover{background:rgba(255,71,87,0.12);box-shadow:0 0 18px rgba(255,71,87,0.5);transform:translateY(-1px)}
        .sc-delete-btn:disabled{opacity:0.5;cursor:not-allowed}
      `}</style>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,136,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.035) 1px,transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0
      }} />
      {/* Glow blobs */}
      <div style={{ position: 'fixed', top: '8%', right: '8%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '15%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: '2rem' }}>
<h1 className="sc-glow-heading" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '2.6rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><HistoryIcon size={30} color={C.green} /> Scan History</h1>
              <p style={{ color: C.textDim, fontSize: '0.9rem' }}>All your previous scans — {filteredScans.length} total</p>
            </div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
  <select
    value={filterMonth}
    onChange={(e) => setFilterMonth(e.target.value)}
    style={{
      background: C.bg2, border: `1px solid ${C.border}`, color: filterMonth ? '#fff' : C.textDim,
      padding: '0.55rem 1rem', borderRadius: '6px', fontSize: '0.85rem',
      fontFamily: "'Inter', sans-serif", cursor: 'pointer', outline: 'none', minWidth: '180px'
    }}
  >
    <option value="" style={{ background: C.bg2 }}>All Months</option>
    {monthOptions.map(m => (
      <option key={m} value={m} style={{ background: C.bg2 }}>{formatMonthLabel(m)}</option>
    ))}
  </select>

  {filterMonth && (
    <button
      onClick={() => setFilterMonth('')}
      style={{ background: 'none', border: `1px solid ${C.border}`, color: C.green, padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
    >
      Clear Filter
    </button>
  )}
</div>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
                <div style={{ width: 36, height: 36, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.green}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
              </div>
            ) : scans.length === 0 ? (
              <div className="sc-glow-panel" style={{ background: C.bg3, border: `1px solid ${C.border}`, padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{marginBottom:'1rem',display:'flex',justifyContent:'center',}}><HistoryIcon size={40} color={C.textDim}/></div>
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>No scans yet</h3>
                <p style={{ color: C.textDim }}>Head to the Scanner to run your first scan</p>
              </div>
            ) : (
              <div className="sc-glow-panel" style={{ background: C.bg3, border: `1px solid ${C.border}`, overflowX: 'auto' }}>
                <table className="sc-hist-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>RISK LEVEL</th>
                      <th>SECRETS FOUND</th>
                      <th>RISK SCORE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredScans.map((scan, i) => {
                        const rc = getRiskColors(scan.riskLevel);
                        return (
                          <motion.tr key={scan._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 3 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.03 }}>
                            <td style={{fontFamily:"'share tech mono',monospace",fontSize:'0.78rem'}}>
                              <span style={{color:'#fff',fontWeight:600}}>
                              </span>
                               {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                <span style={{color:C.textDim,margin:'0 6 px',}}>.</span>
                                <span style={{color:C.green}}>
                                     {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                           
                            </td>
                            <td>
                              <span style={{ padding: '0.3rem 0.9rem', fontSize: '0.7rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace", color: rc.color, background: rc.bg, border: `1px solid ${rc.bar}`, borderRadius: '999px', boxShadow: `0 0 10px ${rc.bar}55`, letterSpacing: '1px' }}>
                     {scan.riskLevel?.toUpperCase()}
                       </span>

                            </td>
                            <td style={{ color: '#fff', fontWeight: 600 }}>{scan.totalSecretsFound}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: '130px', height: '7px', background: C.bg2, border: `1px solid ${C.border}`, overflow: 'hidden', borderRadius: '999px' }}>
                               <motion.div 
                            initial={{ width: 0 }}
                          animate={{ width: `${scan.riskScore}%` }}
                       transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                       style={{ 
                        height: '100%',  background: `linear-gradient(90deg, ${rc.bar}99, ${rc.bar})`, borderRadius: '999px',  boxShadow: `0 0 12px ${rc.bar}`,
                                   }} />
                                 </div>
                                <span style={{ color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem' }}>{scan.riskScore}</span>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setViewScan(scan)} className="sc-action-btn sc-view-btn">👁 VIEW</button>
                                <button onClick={() => handleDelete(scan._id)} disabled={deleting === scan._id} className="sc-action-btn sc-delete-btn">
                                  {deleting === scan._id ? '⏳' : '🗑 DELETE'}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewScan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => setViewScan(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: C.bg3, border: `1px solid ${C.border}`, padding: '1.5rem', maxWidth: '640px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }}></div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }}></div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }}></div>
                  </div>
                  <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.2rem' }}>Scan Details</h3>
                </div>
                <button onClick={() => setViewScan(null)} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: '1.3rem', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = C.textDim}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, padding: '0.8rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{viewScan.riskScore}</p>
                  <p style={{ fontSize: '0.7rem', color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>RISK SCORE</p>
                </div>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, padding: '0.8rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: getRiskColors(viewScan.riskLevel).color, fontFamily: "'Rajdhani', sans-serif" }}>{viewScan.riskLevel}</p>
                  <p style={{ fontSize: '0.7rem', color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>RISK LEVEL</p>
                </div>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, padding: '0.8rem', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{viewScan.totalSecretsFound}</p>
                  <p style={{ fontSize: '0.7rem', color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>SECRETS FOUND</p>
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}></div>
                <p style={{ fontSize: '0.7rem', color:'#fff', marginBottom: '0.5rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>ORIGINAL TEXT</p>
                <button onClick={() => handleCopyText(viewScan.originalText, 'original')} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: "'Share Tech Mono', monospace" }}>
                        {copied === 'original' ? <><Check size={12} /> COPIED</> : <><Copy size={12} /> COPY</>}
                </button>
                <pre style={{ background: '#000', border: `1px solid ${C.border}`, padding: '1rem', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", color: '#fff', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{viewScan.originalText}</pre>
              </div>
              <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}></div>
                <p style={{ fontSize: '0.7rem', color: '#fff', marginBottom: '0.5rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>MASKED TEXT</p>
                <button onClick={()=> handleCopyText(viewScan.maskedText,'masked')} style={{background:'none',border:'none',color:C.textDim,cursor:'pointer',fontsize:'0.68rem',display:'inline-flex',alignItem:'center',gap:'4px',fontFamily:" 'Share Texh Mono',monospace"}}>
                  {copied ==='masked' ?<><Check size={12} /> COPIED</>: <><Copy size={12} />COPY</>}
                </button>

                <pre style={{ background: 'rgba(0,255,136,0.04)', border: `1px solid ${C.border}`, padding: '1rem', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", color: C.green, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{viewScan.maskedText}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}