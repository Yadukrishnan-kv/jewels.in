import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { imageUrl } from "../../api/client.js";
import MobileMenu from "./MobileMenu.jsx";

const STATIC_LINKS = [
  { label: "New Arrivals", to: "/search" },
  { label: "Contact", to: "/contactus" },
  { label: "About Us", to: "/about" },
  { label: "Track", to: "/track" },
];

function CountBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute -top-[7px] -right-[9px] bg-accent text-white text-[0.65rem] font-semibold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-1 leading-none shadow-soft"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const { categories, settings } = useSiteData();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <div className="sticky top-0 z-[100]">
        <header
          className={`bg-white/85 backdrop-blur-xl border-b border-border/70 transition-all duration-500 ease-premium ${
            scrolled ? "shadow-soft py-3" : "py-5"
          }`}
        >
          <div className="max-w-container mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
            {/* brand-logo-wrapper */}
            <div className="flex-1 flex justify-start md:justify-center">
              <Link to="/" className="inline-flex items-center gap-2 px-2 py-1 rounded-full group">
                {settings.logo ? (
                  <img
                    src={imageUrl(settings.logo)}
                    alt={settings.siteName || "Store"}
                    className={`w-auto object-contain transition-all duration-500 ease-premium ${scrolled ? "h-8" : "h-10 md:h-12"}`}
                  />
                ) : (
                  <span
                    className={`font-serif font-medium tracking-wide transition-all duration-500 ease-premium text-primary group-hover:text-accent ${
                      scrolled ? "text-xl" : "text-[1.6rem] md:text-3xl"
                    }`}
                  >
                    {settings.siteName || "Store"}
                  </span>
                )}
              </Link>
            </div>

            {/* search-wrapper (desktop only) */}
            <form onSubmit={submitSearch} className="hidden md:block flex-1 max-w-[320px] relative group">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm pointer-events-none transition-colors group-focus-within:text-accent" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search for jewelry..."
                className="w-full bg-white/70 border border-border/80 rounded-full py-2.5 pl-10 pr-4 text-sm text-primary outline-none transition-all duration-300 ease-premium focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_rgb(var(--color-accent-rgb)/0.1)]"
              />
            </form>

            {/* mobile-header-icons (mobile only) */}
            <div className="flex md:hidden items-center gap-1">
              <Link to="/wishlist" className="icon-btn text-xl relative w-9 h-9" aria-label="Wishlist">
                <i className="fa-regular fa-heart" />
                <CountBadge count={wishCount} />
              </Link>
              <Link to="/cart" className="icon-btn text-xl relative w-9 h-9" aria-label="Cart">
                <i className="fa-solid fa-bag-shopping" />
                <CountBadge count={cartCount} />
              </Link>
              <button className="icon-btn text-2xl w-9 h-9" onClick={() => setMobileOpen(true)} aria-label="Menu">
                <i className="fa-solid fa-bars" />
              </button>
            </div>

            {/* nav-icons (desktop only) */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-5">
              <Link to="/wishlist" className="icon-btn text-lg relative w-9 h-9" aria-label="Wishlist">
                <i className="fa-regular fa-heart transition-transform duration-300 hover:scale-110" />
                <CountBadge count={wishCount} />
              </Link>
              <Link to="/cart" className="icon-btn text-lg relative w-9 h-9" aria-label="Cart">
                <i className="fa-solid fa-bag-shopping transition-transform duration-300 hover:scale-110" />
                <CountBadge count={cartCount} />
              </Link>
            </div>
          </div>
        </header>

        <nav className="hidden md:block bg-white/70 backdrop-blur-xl border-b border-border/60">
          <ul className="max-w-container mx-auto px-5 flex items-center justify-center flex-wrap gap-9 py-3.5">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `relative py-2 text-[0.85rem] font-medium tracking-[0.5px] uppercase transition-colors hover:text-accent ${
                    isActive ? "text-accent" : "text-primary/80"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="relative group">
              <button className="inline-flex items-center gap-1.5 py-2 text-[0.85rem] font-medium tracking-[0.5px] uppercase text-primary/80 transition-colors hover:text-accent">
                Category
                <i className="fa-solid fa-chevron-down text-[9px] transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute -left-4 top-full pt-3 opacity-0 translate-y-1 pointer-events-none transition-all duration-300 ease-premium group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                <div className="min-w-[200px] rounded-2xl border border-border/70 bg-white/95 backdrop-blur-xl py-2.5 shadow-elevated">
                  {categories.map((c) => (
                    <Link
                      key={c._id}
                      to={`/category/${c.slug}`}
                      className="block whitespace-nowrap px-5 py-2.5 text-[0.85rem] text-primary/80 transition-colors hover:bg-secondary hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
            {STATIC_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `relative py-2 text-[0.85rem] font-medium tracking-[0.5px] uppercase transition-colors hover:text-accent ${
                      isActive ? "text-accent" : "text-primary/80"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} />
    </>
  );
}
