import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function StatCard({ label, value, icon, to, tone = "accent", hint, index = 0 }) {
  const Wrapper = to ? Link : "div";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Wrapper
        to={to}
        className={`admin-card-hover group block p-5 ${to ? "cursor-pointer" : ""}`}
      >
        <div className="flex items-start justify-between">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-base transition-transform duration-300 group-hover:scale-110 ${
              tone === "accent"
                ? "bg-accent/10 text-accent"
                : tone === "success"
                ? "bg-emerald-50 text-emerald-600"
                : tone === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-primary/[0.06] text-primary/60"
            }`}
          >
            <i className={`fa-solid ${icon}`} />
          </div>
          {to && (
            <i className="fa-solid fa-arrow-right text-[0.7rem] text-primary/25 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition-all duration-300" />
          )}
        </div>
        <p className="text-2xl font-semibold tracking-tight mt-3.5 text-primary">{value}</p>
        <p className="text-sm text-primary/50 mt-0.5">{label}</p>
        {hint && <p className="text-xs text-primary/35 mt-1.5">{hint}</p>}
      </Wrapper>
    </motion.div>
  );
}
