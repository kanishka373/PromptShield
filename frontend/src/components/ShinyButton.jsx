import { motion } from "framer-motion";

export default function ShinyButton({
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-white ${className}`}
      style={{
        background:
          "linear-gradient(135deg,#6D5DF6 0%,#7C3AED 40%,#00D4FF 100%)",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow:
          "0 0 15px rgba(0,212,255,.35),0 0 35px rgba(124,58,237,.25)",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(110deg,transparent 20%,rgba(255,255,255,.45) 50%,transparent 80%)",
          backgroundSize: "200% 100%",
          animation: "shine 2.5s linear infinite",
        }}
      />

      <span style={{ position: "relative", zIndex: 2 }}>
        {children}
      </span>

      <style>{`
        @keyframes shine{
          from{background-position:-200% 0;}
          to{background-position:200% 0;}
        }
      `}</style>
    </motion.button>
  );
}