import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getProfile, updateProfile, changePassword, exportUserData, deleteAccount, getSummary } from '../services/api';
import { User, Lock, Download, Trash2, Save, Eye, EyeOff } from 'lucide-react';

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

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [totalScans, setTotalScans] = useState(0);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [savingPw, setSavingPw] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s] = await Promise.all([getProfile(), getSummary()]);
        setProfile(p.data);
        setName(p.data.name);
        setTotalScans(s.data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    if (!name.trim()) return setProfileMsg({ type: 'error', text: 'Name cannot be empty' });
    setSavingProfile(true);
    try {
      const { data } = await updateProfile({ name });
      setProfile(data);
      setProfileMsg({ type: 'success', text: '✓ Profile updated successfully' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });
    if (!pwForm.currentPassword || !pwForm.newPassword) return setPwMsg({ type: 'error', text: 'All fields are required' });
    if (pwForm.newPassword.length < 6) return setPwMsg({ type: 'error', text: 'New password must be at least 6 characters' });
    if (pwForm.newPassword !== pwForm.confirm) return setPwMsg({ type: 'error', text: 'Passwords do not match' });
    setSavingPw(true);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg({ type: 'success', text: '✓ Password updated successfully' });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSavingPw(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'promptshield-data-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      localStorage.removeItem('promptshield_user');
      navigate('/');
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');
        @keyframes headingGlow{
          0%,100%{text-shadow:0 0 10px rgba(0,255,136,0.3),0 0 20px rgba(0,255,136,0.15)}
          50%{text-shadow:0 0 20px rgba(0,255,136,0.6),0 0 35px rgba(0,255,136,0.3)}
        }
        .sc-glow-heading{ color:#00ff88 !important; animation:headingGlow 2.5s ease-in-out infinite; }
        @keyframes cardGlow{
          0%,100%{border-color:rgba(0,255,136,0.25);box-shadow:0 0 15px rgba(0,255,136,0.08)}
          50%{border-color:rgba(0,255,136,0.5);box-shadow:0 0 25px rgba(0,255,136,0.18)}
        }
        .sc-card{background:${C.bg3};border:1px solid ${C.border};padding:1.8rem;position:relative;overflow:hidden;transition:all .25s;animation:cardGlow 3s ease-in-out infinite}
        .sc-card:hover{border-color:${C.green} !important;box-shadow:0 0 30px rgba(0,255,136,0.25) !important;animation-play-state:paused}
        .sc-danger-card{background:${C.bg3};border:1px solid rgba(255,71,87,0.35);padding:1.8rem;box-shadow:0 0 15px rgba(255,71,87,0.08)}
        .sc-input{width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;padding:0.75rem 1rem;font-size:0.9rem;outline:none;transition:0.2s;box-sizing:border-box}
        .sc-input:focus{border-color:${C.green};box-shadow:0 0 12px rgba(0,255,136,0.25)}
        .sc-input:disabled{opacity:0.5;cursor:not-allowed}
        .sc-label{font-family:'Share Tech Mono',monospace;font-size:0.7rem;letter-spacing:1.5px;color:${C.textDim};margin-bottom:0.5rem;display:block}
        .sc-btn-primary{background:${C.green};color:${C.bg};padding:0.7rem 1.6rem;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.95rem;border:none;border-radius:6px;cursor:pointer;letter-spacing:1px;transition:all .2s;box-shadow:0 0 15px rgba(0,255,136,0.25);display:inline-flex;align-items:center;gap:8px}
        .sc-btn-primary:hover:not(:disabled){background:#00cc6a;transform:translateY(-2px);box-shadow:0 0 25px rgba(0,255,136,0.45)}
        .sc-btn-primary:disabled{opacity:0.6;cursor:not-allowed}
        .sc-btn-outline{background:transparent;color:${C.green};border:1px solid ${C.green};padding:0.7rem 1.6rem;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.95rem;border-radius:6px;cursor:pointer;letter-spacing:1px;transition:all .2s;box-shadow:0 0 8px rgba(0,255,136,0.15);display:inline-flex;align-items:center;gap:8px}
        .sc-btn-outline:hover:not(:disabled){box-shadow:0 0 20px rgba(0,255,136,0.4);transform:translateY(-2px)}
        .sc-btn-danger{background:transparent;color:${C.red};border:1px solid ${C.red};padding:0.7rem 1.6rem;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.95rem;border-radius:6px;cursor:pointer;letter-spacing:1px;transition:all .2s;box-shadow:0 0 8px rgba(255,71,87,0.15)}
        .sc-btn-danger:hover:not(:disabled){background:rgba(255,71,87,0.12);box-shadow:0 0 20px rgba(255,71,87,0.4);transform:translateY(-2px)}
        .sc-btn-danger:disabled{opacity:0.6;cursor:not-allowed}
        .sc-msg-success{color:${C.green};background:rgba(0,255,136,0.08);border:1px solid ${C.border};padding:0.6rem 1rem;border-radius:6px;font-size:0.82rem;margin-top:1rem}
        .sc-msg-error{color:#ff8a93;background:rgba(255,71,87,0.1);border:1px solid rgba(255,71,87,0.3);padding:0.6rem 1rem;border-radius:6px;font-size:0.82rem;margin-top:1rem}
        .sc-eye-btn{background:none;border:none;color:${C.textDim};cursor:pointer;display:flex;align-items:center}
        @keyframes spin{to{transform:rotate(360deg)}}
        .sc-spinner{width:36px;height:36px;border:2px solid ${C.border};border-top-color:${C.green};border-radius:50%;animation:spin .8s linear infinite}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,136,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.035) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '8%', right: '8%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxWidth: '760px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 className="sc-glow-heading" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: '0.2rem' }}>Settings</h1>
              <p style={{ color: C.textDim, fontSize: '0.9rem' }}>Manage your account and preferences</p>
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
                <div className="sc-spinner"></div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* PROFILE */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sc-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.3rem' }}>
                    <User size={18} color={C.green} />
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Profile</h3>
                  </div>

                  <form onSubmit={handleProfileSave}>
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label className="sc-label">FULL NAME</label>
                      <input className="sc-input" type="text" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label className="sc-label">EMAIL (READ-ONLY)</label>
                      <input className="sc-input" type="email" value={profile?.email || ''} disabled />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.3rem' }}>
                      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, padding: '0.8rem', textAlign: 'center', borderRadius: '8px' }}>
                        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                          {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                        </p>
                        <p style={{ fontSize: '0.68rem', color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>MEMBER SINCE</p>
                      </div>
                      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, padding: '0.8rem', textAlign: 'center', borderRadius: '8px' }}>
                        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.green }}>{totalScans}</p>
                        <p style={{ fontSize: '0.68rem', color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>TOTAL SCANS</p>
                      </div>
                    </div>

                    <button type="submit" disabled={savingProfile} className="sc-btn-primary">
                      <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>

                    {profileMsg.text && <div className={profileMsg.type === 'success' ? 'sc-msg-success' : 'sc-msg-error'}>{profileMsg.text}</div>}
                  </form>
                </motion.div>

                {/* PASSWORD */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sc-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.3rem' }}>
                    <Lock size={18} color={C.green} />
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Change Password</h3>
                  </div>

                  <form onSubmit={handlePasswordSave}>
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label className="sc-label">CURRENT PASSWORD</label>
                      <input className="sc-input" type="password" value={pwForm.currentPassword}
                        onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '1.1rem', position: 'relative' }}>
                      <label className="sc-label">NEW PASSWORD</label>
                      <div style={{ position: 'relative' }}>
                        <input className="sc-input" type={showPw ? 'text' : 'password'} value={pwForm.newPassword}
                          onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} style={{ paddingRight: '2.5rem' }} />
                        <button type="button" className="sc-eye-btn" onClick={() => setShowPw(!showPw)}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: C.textDim, marginTop: '0.4rem' }}>Minimum 6 characters</p>
                    </div>
                    <div style={{ marginBottom: '1.3rem' }}>
                      <label className="sc-label">CONFIRM NEW PASSWORD</label>
                      <input className="sc-input" type="password" value={pwForm.confirm}
                        onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
                    </div>

                    <button type="submit" disabled={savingPw} className="sc-btn-primary">
                      <Lock size={16} /> {savingPw ? 'Updating...' : 'Update Password'}
                    </button>

                    {pwMsg.text && <div className={pwMsg.type === 'success' ? 'sc-msg-success' : 'sc-msg-error'}>{pwMsg.text}</div>}
                  </form>
                </motion.div>

                {/* EXPORT DATA */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sc-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                    <Download size={18} color={C.green} />
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Export Your Data</h3>
                  </div>
                  <p style={{ color: C.textDim, fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: 1.6 }}>
                    Download a copy of your profile and complete scan history as a JSON file.
                  </p>
                  <button onClick={handleExport} disabled={exporting} className="sc-btn-outline">
                    <Download size={16} /> {exporting ? 'Preparing export...' : 'Export My Data'}
                  </button>
                </motion.div>

                {/* DANGER ZONE */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="sc-danger-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                    <Trash2 size={18} color={C.red} />
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#ff8a93' }}>Danger Zone</h3>
                  </div>
                  <p style={{ color: C.textDim, fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: 1.6 }}>
                    Permanently delete your account and all associated scan history. This action cannot be undone.
                  </p>
                  <button onClick={() => setDeleteConfirm(true)} className="sc-btn-danger">
                    Delete Account
                  </button>
                </motion.div>

              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => { setDeleteConfirm(false); setDeleteInput(''); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: C.bg3, border: '1px solid rgba(255,71,87,0.4)', borderRadius: '10px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 0 30px rgba(255,71,87,0.2)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Trash2 size={20} color={C.red} />
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.2rem' }}>Delete Account?</h3>
              </div>
              <p style={{ color: C.textDim, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                This will permanently delete your account and all scan history. Type <strong style={{ color: '#ff8a93' }}>DELETE</strong> to confirm.
              </p>
              <input className="sc-input" type="text" value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                placeholder="Type DELETE" style={{ marginBottom: '1.3rem' }} />
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button onClick={() => { setDeleteConfirm(false); setDeleteInput(''); }} className="sc-btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} disabled={deleteInput !== 'DELETE' || deleting} className="sc-btn-danger" style={{ flex: 1 }}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}