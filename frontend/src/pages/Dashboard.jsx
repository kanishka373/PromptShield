import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import { Search, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getSummary, getHistory } from '../services/api';

const PIE_COLORS = ['#ff4757', '#ffb020', '#00ff88'];

const C = {
  green: '#00ff88',
  bg: '#080c10',
  bg2: '#0d1117',
  bg3: '#141b22',
  border: 'rgba(0,255,136,0.18)',
  text: '#c9d1d9',
  textDim: '#8b949e',
  red: '#ff4757',
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [s, h] = await Promise.all([getSummary(), getHistory()]);
        setSummary(s.data);
        setHistory(h.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pieData = summary ? [
    { name: 'High', value: summary.high || 0 },
    { name: 'Medium', value: summary.medium || 0 },
    { name: 'Low', value: summary.low || 0 },
  ] : [];

  const getRiskBadge = (level) => {
    const map = {
      High: { color: '#ff8a93', bg: 'rgba(255,71,87,0.12)', border: 'rgba(255,71,87,0.3)' },
      Medium: { color: '#ffcf7a', bg: 'rgba(255,176,32,0.12)', border: 'rgba(255,176,32,0.3)' },
      Low: { color: C.green, bg: 'rgba(0,255,136,0.08)', border: C.border },
    };
    return map[level] || map.Low;
  };
  const getBarColor=(level)=>{
    const map={High:'#ff4757',medium:'#ffb020',low:C.green}
    return map[level] ||C.green;
  }
;
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
        @keyframes cardGlow{
          0%,100%{border-color:rgba(0,255,136,0.25);box-shadow:0 0 15px rgba(0,255,136,0.08)}
          50%{border-color:rgba(0,255,136,0.5);box-shadow:0 0 25px rgba(0,255,136,0.18)}
        }
        .sc-card{background:${C.bg3};border:1px solid ${C.border};padding:1.5rem;position:relative;overflow:hidden;transition:all .25s;animation:cardGlow 3s ease-in-out infinite}
        .sc-card:hover{border-color:${C.green} !important;box-shadow:0 0 30px rgba(0,255,136,0.25) !important;animation-play-state:paused}
        .shiny-card::before{content:'';position:absolute;top:0;left:-150%;width:60%;height:100%;background:linear-gradient(120deg,transparent,rgba(0,255,136,0.15),transparent);transform:skewX(-20deg);transition:left 0.6s ease}
        .shiny-card:hover::before{left:150%}
        .sc-btn-primary{background:${C.green};color:${C.bg};padding:0.7rem 1.5rem;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.95rem;border:none;cursor:pointer;letter-spacing:1px;transition:all .2s;box-shadow:0 0 15px rgba(0,255,136,0.25)}
        .sc-btn-primary:hover{background:#00cc6a;transform:translateY(-2px);box-shadow:0 0 25px rgba(0,255,136,0.45)}
        .sc-link{color:${C.green};font-family:'Share Tech Mono',monospace;font-size:0.8rem;background:none;border:none;cursor:pointer;letter-spacing:1px}
        .sc-link:hover{color:#fff}
       .sc-table th{font-family:'Share Tech Mono',monospace;font-size:0.7rem;letter-spacing:2px;text-align:left;padding:0.9rem 1rem;border-bottom:2px solid ${C.green};background:rgba(0,255,136,0.04)}
        .sc-table td{padding:0.8rem 1rem;border-bottom:1px solid rgba(0,255,136,0.08);font-size:0.85rem}
        .sc-table tr{transition:background 0.2s}
        .sc-table tr:hover td{background:${C.bg3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .sc-spinner{width:36px;height:36px;border:2px solid ${C.border};border-top-color:${C.green};border-radius:50%;animation:spin .8s linear infinite}
      `}
      </style>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,136,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.035) 1px,transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0
      }} />
      {/* Glow blobs */}
      <div style={{ position: 'fixed', top: '5%', right: '10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '25%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="sc-glow-heading" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: '0.2rem' }}>Dashboard</h1>
              </div>
              <button onClick={() => navigate('/scanner')} className="sc-btn-primary">⚡ NEW SCAN</button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
                <div className="sc-spinner"></div>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                  <StatsCard icon={Search} label="Total Scans" value={summary?.total ?? 0} color="primary" delay={0} />
                  <StatsCard icon={Lock} label="Secrets Found" value={summary?.totalSecrets ?? 0} color="warning" delay={0.1} />
                  <StatsCard icon={AlertTriangle} label="High Risk Scans" value={summary?.high ?? 0} color="danger" delay={0.2} />
                  <StatsCard icon={CheckCircle2} label="Safe Scans" value={summary?.safe ?? 0} color="success" delay={0.3} />
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="sc-card shiny-card">
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Weekly Activity</h3>
                    {summary?.weekly?.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={summary.weekly}>
                          <XAxis dataKey="day" tick={{ fill: C.textDim, fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: C.textDim, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: '6px', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', padding: '8px 12px' }}
                            itemStyle={{ color: '#00ff88', fontWeight: 700 }}
                            labelStyle={{ color: '#ffffff', marginBottom: '4px' }}
                          />
                          <Bar dataKey="scans" fill={C.green} radius={[0, 0, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ height: '12rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textDim, fontSize: '0.85rem' }}>No scan data yet</div>
                    )}
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="sc-card shiny-card">
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Risk Distribution</h3>
                    {summary?.total > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <ResponsiveContainer width="60%" height={200}>
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke={C.bg3}>
                              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background: C.bg2, border: `1px solid ${C.border}`, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem' }}
                              itemStyle={{ color: C.green }}
                              labelStyle={{ color: '#fff' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                          {[['High', PIE_COLORS[0], summary.high], ['Medium', PIE_COLORS[1], summary.medium], ['Low', PIE_COLORS[2], summary.low]].map(([l, c, v]) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace" }}>
                              <div style={{ width: 10, height: 10, background: c, boxShadow: `0 0 8px ${c}` }}></div>
                              <span style={{ color: C.textDim }}>{l}</span>
                              <span style={{ color: '#fff', fontWeight: 700, marginLeft: 'auto' }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: '12rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textDim, fontSize: '0.85rem' }}>Run your first scan to see distribution</div>
                    )}
                  </motion.div>
                </div>

                {/* Recent scans */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="sc-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Recent Scans</h3>
                    <button onClick={() => navigate('/history')} className="sc-link">VIEW ALL →</button>
                  </div>
                  {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: C.textDim }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🔍</div>
                      <p>No scans yet. <button onClick={() => navigate('/scanner')} className="sc-link" style={{ display: 'inline' }}>Run your first scan →</button></p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="sc-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th>DATE</th>
                            <th>RISK LEVEL</th>
                            <th>SECRETS FOUND</th>
                            <th>RISK SCORE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((scan) => {
                            const badge = getRiskBadge(scan.riskLevel);
                            return (
                              <tr key={scan._id}>
                                <td style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem' }}>
                                  <span style={{ color: '#fff', fontWeight: 600 }}>
                                    {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ padding: '0.3rem 0.9rem', fontSize: '0.7rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', color: badge.color, background: badge.bg, border: `1px solid ${badge.color}`, borderRadius: '999px', boxShadow: `0 0 10px ${badge.color}55` }}>
                                    {scan.riskLevel?.toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ color: '#fff', fontWeight: 600 }}>{scan.totalSecretsFound}</td>
                               <td>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
    <div style={{ width: '100px', height: '7px', background: C.bg2, border: `1px solid ${C.border}`, overflow: 'hidden', borderRadius: '999px' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${scan.riskScore}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ height: '100%', background: `linear-gradient(90deg, ${getBarColor(scan.riskLevel)}99, ${getBarColor(scan.riskLevel)})`, borderRadius: '999px', boxShadow: `0 0 10px ${getBarColor(scan.riskLevel)}` }}
      />
    </div>
    <span style={{ color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem' }}>{scan.riskScore}</span>
  </div>
</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}