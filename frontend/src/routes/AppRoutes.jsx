import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Landing from '../pages/Landing';
import AuthShield from '../pages/AuthShield';
import Dashboard from '../pages/Dashboard';
import Scanner from '../pages/Scanner';
import History from '../pages/History';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080c10' }}><div style={{ width: 32, height: 32, border: '2px solid rgba(0,255,136,0.18)', borderTop: '2px solid #00ff88', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div></div>;
  return user ? children : <Navigate to="/login" />;
};

// Ye wrapper har page ko fade + slide animation deta hai
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

// Ye component actual routes render karta hai, aur location track karta hai
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><AuthShield initialMode="login" /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><AuthShield initialMode="signup" /></PageWrapper>} />
        <Route path="/dashboard" element={<Protected><PageWrapper><Dashboard /></PageWrapper></Protected>} />
        <Route path="/scanner" element={<Protected><PageWrapper><Scanner /></PageWrapper></Protected>} />
        <Route path="/history" element={<Protected><PageWrapper><History /></PageWrapper></Protected>} />
        <Route path="/reports" element={<Protected><PageWrapper><Reports /></PageWrapper></Protected>} />
        <Route path="/settings" element={<Protected><PageWrapper><Settings /></PageWrapper></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}