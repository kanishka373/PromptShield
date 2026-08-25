import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';
import Sidebar from '../components/Sidebar';
import { getSummary, getHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const C = {
  green: '#00ff88',
  bg: '#080c10',
  bg2: '#0d1117',
  bg3: '#141b22',
  border: 'rgba(0,255,136,0.18)',
  text: '#c9d1d9',
  textDim: '#8b949e',
};

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [s, h] = await Promise.all([getSummary(), getHistory()]);
        setSummary(s.data);
        setScans(h.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const detectionTotals = scans.reduce((acc, scan) => {
    if (scan.secretsFound) {
      Object.entries(scan.secretsFound).forEach(([key, val]) => {
        acc[key] = (acc[key] || 0) + (val || 0);
      });
    }
    return acc;
  }, {});

  const detectionChartData = Object.entries(detectionTotals)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k.replace(/([A-Z])/g, ' $1').trim(), count: v }));

  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      const now = new Date().toLocaleDateString();

      doc.setFillColor(8, 12, 16);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(0, 255, 136);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('PromptShield', 15, 20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text('Security Scan Report', 15, 30);
      doc.text(`Generated: ${now}`, 140, 30);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.text(`Report for: ${user?.name} (${user?.email})`, 15, 52);

      doc.setFillColor(240, 250, 245);
      doc.rect(10, 60, 190, 55, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Summary Statistics', 15, 72);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const stats = [
        `Total Scans: ${summary?.total ?? 0}`,
        `Total Secrets Found: ${summary?.totalSecrets ?? 0}`,
        `High Risk Scans: ${summary?.high ?? 0}`,
        `Medium Risk Scans: ${summary?.medium ?? 0}`,
        `Low Risk Scans: ${summary?.low ?? 0}`,
        `Safe Scans (0 secrets): ${summary?.safe ?? 0}`,
      ];
      stats.forEach((s, i) => doc.text(s, 15 + (i % 2) * 95, 83 + Math.floor(i / 2) * 10));

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Detection Breakdown', 15, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      let y = 138;
      Object.entries(detectionTotals).forEach(([k, v]) => {
        if (v > 0) {
          doc.text(`${k.replace(/([A-Z])/g, ' $1').trim()}: ${v} found`, 15, y);
          y += 8;
        }
      });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Recent Scans (Last 10)', 15, y);
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setFillColor(8, 12, 16);
      doc.setTextColor(0, 255, 136);
      doc.rect(10, y - 6, 190, 8, 'F');
      doc.text('Date', 15, y);
      doc.text('Risk Level', 60, y);
      doc.text('Secrets Found', 100, y);
      doc.text('Risk Score', 155, y);
      y += 4;
      doc.setTextColor(50, 50, 50);

      scans.slice(0, 10).forEach((scan, i) => {
        if (i % 2 === 0) { doc.setFillColor(240, 250, 245); doc.rect(10, y - 3, 190, 8, 'F'); }
        doc.text(new Date(scan.createdAt).toLocaleDateString(), 15, y + 2);
        doc.text(scan.riskLevel, 60, y + 2);
        doc.text(String(scan.totalSecretsFound), 100, y + 2);
        doc.text(`${scan.riskScore}/100`, 155, y + 2);
        y += 8;
        if (y > 270) { doc.addPage(); y = 20; }
      });

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('PromptShield — Secure Prompt Gateway | Confidential Security Report', 15, 290);

      doc.save(`PromptShield_Report_${now.replace(/\//g, '-')}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Risk Level', 'Secrets Found', 'Risk Score'];
    const rows = scans.map(s => [
      new Date(s.createdAt).toLocaleDateString(),
      s.riskLevel,
      s.totalSecretsFound,
      s.riskScore
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'PromptShield_Report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

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
        .sc-btn-outline{background:transparent;border:1px solid ${C.border};color:${C.textDim};padding:0.5rem 1.2rem;font-family:'Share Tech Mono',monospace;font-size:0.8rem;cursor:pointer;letter-spacing:1px;transition:all .2s}
        .sc-btn-outline:hover:not(:disabled){border-color:${C.green};color:${C.green};background:rgba(0,255,136,0.05)}
        .sc-btn-outline:disabled{opacity:0.4;cursor:not-allowed}
        .sc-btn-primary{background:${C.green};color:${C.bg};padding:0.5rem 1.5rem;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.9rem;border:none;cursor:pointer;letter-spacing:1px;transition:all .2s;box-shadow:0 0 15px rgba(0,255,136,0.25)}
        .sc-btn-primary:hover:not(:disabled){background:#00cc6a;box-shadow:0 0 25px rgba(0,255,136,0.4)}
        .sc-btn-primary:disabled{opacity:0.5;cursor:not-allowed}
        .sc-report-card{background:${C.bg3};border:1px solid ${C.border};padding:1.2rem;transition:border-color .2s}
        .sc-report-card:hover{border-color:${C.green}}
      `}</style>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,136,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.035) 1px,transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0
      }} />
      {/* Glow blobs */}
      <div style={{ position: 'fixed', top: '8%', left: '10%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', right: '10%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="sc-glow-heading" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: '0.2rem' }}>Reports</h1>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleExportCSV} disabled={loading || scans.length === 0} className="sc-btn-outline">
                  📁 EXPORT CSV
                </button>
                <button onClick={handleDownloadPDF} disabled={loading || generating || scans.length === 0} className="sc-btn-primary">
                  {generating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(8,12,16,0.3)', borderTop: `2px solid ${C.bg}`, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                      GENERATING...
                    </span>
                  ) : '📄 DOWNLOAD PDF'}
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
                <div style={{ width: 36, height: 36, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.green}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
              </div>
            ) : (
              <>
                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
                 {[
  { label: 'Total Scans', val: summary?.total ?? 0, icon: Search, color: C.green },
  { label: 'Secrets Found', val: summary?.totalSecrets ?? 0, icon: Lock, color: '#ffb020' },
  { label: 'High Risk', val: summary?.high ?? 0, icon: AlertTriangle, color: '#ff4757' },
  { label: 'Safe Scans', val: summary?.safe ?? 0, icon: CheckCircle2, color: C.green },
].map(({ label, val, icon: Icon, color }) => (
  <div key={label} className="sc-report-card sc-glow-panel">
    <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18`, border: `1px solid ${color}40` }}>
      <Icon size={16} strokeWidth={2} color={color} />
    </div>
    <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.7rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>{val}</p>
    <p style={{ fontSize: '0.8rem', color: C.textDim }}>{label}</p>
  </div>
))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '1.5rem' }}>
                  {/* Weekly trend */}
                  <div className="sc-report-card sc-glow-panel">
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem' }}>Weekly Scan Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={summary?.weekly || []}>
                        <XAxis dataKey="day" tick={{ fill: C.textDim, fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: C.textDim, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: C.bg2, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem' }} />
                        <Line type="monotone" dataKey="scans" stroke={C.green} strokeWidth={2} dot={{ fill: C.green, r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Detection breakdown */}
                  <div className="sc-report-card sc-glow-panel">
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem' }}>Detection Breakdown</h3>
                    {detectionChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={detectionChartData} layout="vertical">
                          <XAxis type="number" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="name" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                          <Tooltip contentStyle={{ background: C.bg2, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem' }} />
                          <Bar dataKey="count" fill={C.green} radius={[0, 0, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ height: '12rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textDim, fontSize: '0.85rem' }}>No detection data yet</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}