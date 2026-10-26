import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, onClose, title, subtitle, children, wide }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative bg-white rounded-3xl shadow-elevated w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[88vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-start gap-4 px-6 py-5 border-b border-border sticky top-0 bg-white/95 backdrop-blur z-10 rounded-t-3xl">
              <div>
                <h3 className="font-semibold text-primary">{title}</h3>
                {subtitle && <p className="text-xs text-primary/45 mt-0.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="admin-icon-btn -mr-2 -mt-1" aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
