import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function SearchPanel({ open, onClose }) {
  const { categories } = useSiteData();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/45 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="absolute top-0 left-0 right-0 bg-secondary border-b border-border/60 shadow-elevated"
          >
            <div className="max-w-container mx-auto px-5 md:px-8 py-8 md:py-12">
              <div className="flex items-center justify-between mb-6">
                <span className="micro text-primary/40">Search the store</span>
                <button onClick={onClose} className="icon-btn text-xl w-10 h-10" aria-label="Close search">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <form onSubmit={submit} className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-0 top-1/2 -translate-y-1/2 text-primary/30 text-lg" />
                <input
                  autoFocus={open}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-b border-primary/20 focus:border-accent pl-8 pr-4 py-3 font-serif text-[1.4rem] md:text-[2rem] text-primary outline-none placeholder:text-primary/25 transition-colors"
                />
              </form>
              <div className="flex flex-wrap items-center gap-2 mt-6">
                <span className="micro text-primary/35 mr-2">Popular:</span>
                {categories.slice(0, 6).map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    onClick={onClose}
                    className="micro px-4 py-2 border border-primary/15 rounded-[2px] text-primary/65 hover:border-accent hover:text-accent transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
