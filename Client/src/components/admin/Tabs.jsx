import { motion } from "framer-motion";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-primary/[0.04] rounded-xl w-fit flex-wrap mb-6">
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
              isActive ? "text-white" : "text-primary/55 hover:text-primary"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="admin-tab-pill"
                className="absolute inset-0 bg-primary rounded-lg"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {t.icon && <i className={`fa-solid ${t.icon} text-xs`} />}
              {t.label}
              {typeof t.count === "number" && (
                <span className={`text-[0.68rem] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-primary/10"}`}>{t.count}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
