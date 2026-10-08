import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", to: "/", icon: "fa-house" },
  { label: "New Arrivals", to: "/search", icon: "fa-sparkles" },
  { label: "Contact", to: "/contactus", icon: "fa-envelope" },
  { label: "About Us", to: "/about", icon: "fa-gem" },
  { label: "Track", to: "/track", icon: "fa-truck-fast" },
];

export default function MobileMenu({ open, onClose, categories }) {
  const [catOpen, setCatOpen] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[160] md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="absolute top-0 left-0 h-full w-[85%] max-w-[340px] bg-secondary shadow-elevated overflow-y-auto"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-border/60">
              <span className="font-serif text-lg text-primary">Menu</span>
              <button onClick={onClose} className="icon-btn text-xl w-9 h-9" aria-label="Close menu">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <ul className="flex flex-col px-5 py-3 gap-1 pb-10">
              <li>
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-3 py-3.5 px-2 border-b border-border/60 font-medium text-primary transition-colors hover:text-accent"
                >
                  <i className="fa-solid fa-house w-5 text-center text-accent/70" />
                  Home
                </Link>
              </li>
              <li className="border-b border-border/60">
                <button
                  onClick={() => setCatOpen((v) => !v)}
                  className="w-full flex justify-between items-center py-3.5 px-2 font-medium text-primary"
                >
                  <span className="flex items-center gap-3">
                    <i className="fa-solid fa-layer-group w-5 text-center text-accent/70" />
                    Category
                  </span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {catOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-10">
                        {categories.map((c) => (
                          <Link
                            key={c._id}
                            to={`/category/${c.slug}`}
                            onClick={onClose}
                            className="block py-2 text-sm text-primary/70 hover:text-accent transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              {NAV_LINKS.slice(1).map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3.5 px-2 border-b border-border/60 font-medium text-primary transition-colors hover:text-accent"
                  >
                    <i className={`fa-solid ${l.icon} w-5 text-center text-accent/70`} />
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="flex gap-3 pt-5">
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-medium border border-border rounded-full py-3 hover:border-accent hover:text-accent transition-colors"
                >
                  <i className="fa-regular fa-heart" /> Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-accent text-white rounded-full py-3 hover:bg-accent-light transition-colors"
                >
                  <i className="fa-solid fa-bag-shopping" /> Cart
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
