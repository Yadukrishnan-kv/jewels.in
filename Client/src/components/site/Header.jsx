import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      setScrolled(window.scrollY > 50);
    }
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
        <header className="bg-secondary border-b border-border py-4">
          <div className="max-w-container mx-auto px-6 md:px-8 flex items-center justify-between flex-wrap gap-4">
            {/* brand-logo-wrapper */}
            <div className="flex-1 flex justify-start md:justify-center">
              <Link to="/" className="inline-flex items-center px-2 py-1 rounded-full">
                {settings.logo ? (
                  <img
                    src={imageUrl(settings.logo)}
                    alt={settings.siteName || "Store"}
                    className={`w-auto object-contain transition-all ${scrolled ? "h-9" : "h-9 md:h-12"}`}
                  />
                ) : (
                  <span
                    className={`font-serif font-semibold tracking-wide transition-all ${
                      scrolled ? "text-xl" : "text-2xl md:text-3xl"
                    }`}
                  >
                    {settings.siteName || "Store"}
                  </span>
                )}
              </Link>
            </div>

            {/* search-wrapper (desktop only) */}
            <form onSubmit={submitSearch} className="hidden md:block flex-1 max-w-[300px] relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#4a3f2f] text-sm pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search Products"
                className="w-full bg-[#f2efeb] border border-[#142c24] rounded-full py-2.5 pl-10 pr-4 text-sm text-primary outline-none transition-shadow focus:border-accent focus:shadow-[0_0_0_2px_rgba(20,46,37,0.2)]"
              />
            </form>

            {/* mobile-header-icons (mobile only) */}
            <div className="flex md:hidden items-center">
              <button className="icon-btn text-2xl" onClick={() => setMobileOpen(true)} aria-label="Menu">
                <i className="fa-solid fa-bars" />
              </button>
            </div>

            {/* nav-icons (desktop only) */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-6">
              <Link to="/wishlist" className="icon-btn text-lg relative" aria-label="Wishlist">
                <i className="fa-regular fa-heart" />
                {wishCount > 0 && (
                  <span className="absolute -top-[6px] -right-[10px] bg-accent text-white text-[0.65rem] font-semibold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                    {wishCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="icon-btn text-lg relative" aria-label="Cart">
                <i className="fa-solid fa-bag-shopping" />
                {cartCount > 0 && (
                  <span className="absolute -top-[6px] -right-[10px] bg-accent text-white text-[0.65rem] font-semibold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>

        <nav
          className={`hidden md:block border-b border-border transition-colors ${
            scrolled ? "bg-white/70 backdrop-blur-md" : "bg-secondary"
          }`}
        >
          <ul className="max-w-container mx-auto px-5 flex items-center justify-center flex-wrap gap-8 py-3.5">
            <li>
              <Link to="/" className="text-[0.9rem] font-medium tracking-[0.5px] hover:text-accent">
                Home
              </Link>
            </li>
            <li className="relative group">
              <button className="inline-flex items-center py-2 text-[0.9rem] font-medium tracking-[0.5px] hover:text-accent">
                Category
                <span className="ml-[6px] w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#4a3f2f]" />
              </button>
              <div className="absolute -left-2.5 top-8 z-10 hidden min-w-[160px] rounded-2xl border border-[#e6dfd1] bg-white py-2 shadow-xl group-hover:block">
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    className="block whitespace-nowrap px-5 py-2.5 text-[0.85rem] text-[#2c2c2c] hover:text-accent"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </li>
            {STATIC_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-[0.9rem] font-medium tracking-[0.5px] hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} />
    </>
  );
}
