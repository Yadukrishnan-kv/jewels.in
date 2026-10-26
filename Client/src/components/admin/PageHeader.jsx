import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start justify-between gap-4 flex-wrap mb-7"
    >
      <div>
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-wider uppercase text-accent mb-1.5">
            {eyebrow}
          </span>
        )}
        <h1 className="text-[1.5rem] md:text-[1.7rem] font-semibold tracking-tight text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-primary/50 mt-1 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
    </motion.div>
  );
}
