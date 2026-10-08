import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
    onClose();
    setQuery("");
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-xl p-6 shadow-elevated"
          >
            <form onSubmit={submit} className="max-w-container mx-auto flex items-center gap-4">
              <i className="fa-solid fa-magnifying-glass text-lg text-accent" />
              <input
                autoFocus={open}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search for jewelry..."
                className="flex-1 border-b-2 border-border py-2.5 text-lg outline-none focus:border-accent bg-transparent transition-colors"
              />
              <button type="button" onClick={onClose} className="icon-btn text-xl w-9 h-9" aria-label="Close search">
                <i className="fa-solid fa-xmark" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
