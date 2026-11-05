import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { imageUrl } from "../../api/client.js";
import MobileMenu from "./MobileMenu.jsx";
import SearchPanel from "./SearchPanel.jsx";

const STATIC_LINKS = [
  { label: "New Arrivals", to: "/search" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contactus" },
  { label: "My Orders", to: "/track" },
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
          className="absolute -top-1 -right-1.5 bg-accent text-white text-[0.6rem] font-semibold rounded-[2px] min-w-[16px] h-4 flex items-center justify-center px-1 leading-none"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function NavItem({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `micro py-2 transition-colors duration-300 hover:text-accent ${isActive ? "text-accent" : "text-primary/70"}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const { categories, settings } = useSiteData();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (    <>
      <header
        className={`sticky top-0 z-[100] border-b transition-all duration-500 ease-premium ${
          scrolled
            ? "bg-secondary/90 backdrop-blur-xl border-border/60 shadow-soft"
            : "bg-secondary/60 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="max-w-container mx-auto px-5 md:px-8 h-16 md:h-[76px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: nav (desktop) / hamburger (mobile) */}
          <nav className="hidden md:flex items-center gap-7 justify-self-start">
            <div className="relative group">
              <button className="micro py-2 inline-flex items-center gap-1.5 text-primary/70 transition-colors hover:text-accent group-hover:text-accent">
                Shop
                <i className="fa-solid fa-chevron-down text-[8px] opacity-60 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              {/* Mega panel */}
              <div className="absolute left-0 top-full pt-3 opacity-0 translate-y-1 pointer-events-none transition-all duration-300 ease-premium group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                <div className="w-[min(680px,92vw)] bg-white border border-border/60 shadow-elevated px-7 py-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-7 gap-y-0">
                    {categories.map((c, i) => (
                      <Link
                        key={c._id}
                        to={`/category/${c.slug}`}
                        className="group/link flex items-center justify-between gap-3 py-2.5 border-b border-border/40 text-[0.85rem] text-primary/80 transition-colors hover:text-accent"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className="micro text-primary/25 tabular-nums shrink-0">{String(i + 1).padStart(2, "0")}</span>
                          <span className="truncate">{c.name}</span>
                        </span>
                        <i className="fa-solid fa-arrow-right text-[0.6rem] opacity-0 -translate-x-1 transition-all duration-300 group-hover/link:opacity-60 group-hover/link:translate-x-0 shrink-0" />
                      </Link>
                    ))}
                    {categories.length === 0 && (
                      <Link to="/search" className="py-2.5 text-sm text-primary/60 hover:text-accent transition-colors">
                        Browse all products
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {STATIC_LINKS.map((l) => (
              <NavItem key={l.to} to={l.to}>
                {l.label}
              </NavItem>
            ))}
          </nav>

          <button
            className="md:hidden icon-btn text-lg w-10 h-10 -ml-2 justify-self-start"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <i className="fa-solid fa-bars" />
          </button>

          {/* Center: wordmark */}
          <Link to="/" className="justify-self-center flex items-center px-2 py-1 group">
            {settings.logo ? (
              <img
                src={imageUrl(settings.logo)}
                alt={settings.siteName || "Store"}
                className={`w-auto object-contain transition-all duration-500 ease-premium ${scrolled ? "h-8" : "h-9 md:h-10"}`}
              />
            ) : (
              <span
                className={`font-serif font-medium tracking-[-0.01em] text-primary transition-all duration-500 ease-premium group-hover:text-accent ${
                  scrolled ? "text-[1.15rem]" : "text-[1.3rem] md:text-[1.5rem]"
                }`}
              >
                {settings.siteName || "Store"}
              </span>
            )}
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-1 md:gap-2 justify-self-end">
            <button
              className="icon-btn text-[0.95rem] w-10 h-10"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass transition-transform duration-300 hover:scale-110" />
            </button>
            <div className="hidden md:flex items-center gap-1 md:gap-2">
              <Link to="/wishlist" className="icon-btn text-[0.95rem] w-10 h-10" aria-label="Wishlist">
                <i className="fa-regular fa-heart transition-transform duration-300 hover:scale-110" />
                <CountBadge count={wishCount} />
              </Link>
              <Link to="/cart" className="icon-btn text-[0.95rem] w-10 h-10" aria-label="Cart">
                <i className="fa-solid fa-bag-shopping transition-transform duration-300 hover:scale-110" />
                <CountBadge count={cartCount} />
              </Link>
              <Link
                to={user ? "/account" : "/login"}
                className="icon-btn text-[0.95rem] w-10 h-10"
                aria-label={user ? "My account" : "Login"}
              >
                <i className="fa-regular fa-user transition-transform duration-300 hover:scale-110" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
