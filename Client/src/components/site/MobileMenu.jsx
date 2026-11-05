import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteData } from "../../context/SiteDataContext.jsx";

const NAV_LINKS = [
  { label: "New Arrivals", to: "/search" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contactus" },
  { label: "My Orders", to: "/track" },
];

const SOCIALS = [
  { key: "instagram", icon: "fa-brands fa-instagram" },
  { key: "facebook", icon: "fa-brands fa-facebook-f" },
  { key: "youtube", icon: "fa-brands fa-youtube" },
];

export default function MobileMenu({ open, onClose, categories }) {
  const { settings } = useSiteData();
  const [catOpen, setCatOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[160] bg-secondary md:hidden flex flex-col overflow-y-auto"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-border/60 shrink-0">
            <span className="font-serif text-lg text-primary">{settings.siteName || "Store"}</span>
            <button onClick={onClose} className="icon-btn text-xl w-10 h-10" aria-label="Close menu">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <nav className="px-5 pt-8 pb-4">
            <Link
              to="/"
              onClick={onClose}
              className="block font-serif text-[1.9rem] leading-none text-primary py-3 border-b border-border/50 hover:text-accent transition-colors"
            >
              Home
            </Link>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={onClose}
                className="block font-serif text-[1.9rem] leading-none text-primary py-3 border-b border-border/50 hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="px-5 pb-8">
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="micro flex items-center justify-between w-full py-3 text-primary/50 border-b border-border/50"
            >
              Collections
              <i className={`fa-solid fa-chevron-down text-[9px] transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
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
                  <div className="grid grid-cols-2 gap-x-6 py-3">
                    {categories.map((c, i) => (
                      <Link
                        key={c._id}
                        to={`/category/${c.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-2.5 py-2 text-[0.85rem] text-primary/75 hover:text-accent transition-colors border-b border-border/40"
                      >
                        <span className="micro text-primary/25 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto px-5 pb-10 pt-4 border-t border-border/60">
            <div className="flex gap-3">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 micro border border-primary/20 rounded-[2px] py-3.5 hover:bg-primary hover:text-white transition-colors"
              >
                <i className="fa-regular fa-heart" /> Wishlist
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 micro bg-accent text-white rounded-[2px] py-3.5 hover:bg-accent-light transition-colors"
              >
                <i className="fa-solid fa-bag-shopping" /> Cart
              </Link>
            </div>
            {SOCIALS.some((s) => settings.socialLinks?.[s.key]) && (
              <div className="flex gap-2 mt-6">
                {SOCIALS.map(
                  ({ key, icon }) =>
                    settings.socialLinks?.[key] && (
                      <a
                        key={key}
                        href={settings.socialLinks[key]}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={key}
                        className="w-10 h-10 border border-primary/15 rounded-[2px] flex items-center justify-center text-primary/60 hover:border-accent hover:text-accent transition-colors"
                      >
                        <i className={icon} />
                      </a>
                    )
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
