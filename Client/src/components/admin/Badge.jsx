const TONES = {
  neutral: "bg-primary/[0.06] text-primary/60",
  accent: "bg-accent/10 text-accent",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  info: "bg-sky-50 text-sky-700",
};

const DOT_TONES = {
  neutral: "bg-primary/30",
  accent: "bg-accent",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
};

export default function Badge({ tone = "neutral", dot = false, children, className = "" }) {
  return (
    <span className={`admin-badge capitalize ${TONES[tone] || TONES.neutral} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT_TONES[tone] || DOT_TONES.neutral}`} />}
      {children}
    </span>
  );
}
