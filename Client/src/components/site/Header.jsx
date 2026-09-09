import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import MobileMenu from "./MobileMenu.jsx";
import SearchPanel from "./SearchPanel.jsx";

const STATIC_LINKS = [
  { label: "New Arrivals", to: "/search" },
  { label: "Contact", to: "/contactus" },
  { label: "About Us", to: "/about" },
  { label: "Track", to: "/track" },
];

export default function Header() {
  const { categories } = useSiteData();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
      <header
        className={`sticky top-0 z-[100] bg-secondary border-b border-border transition-[padding] ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="max-w-container mx-auto px-4 md:px-8 flex items-center justify-between gap-4 flex-wrap">
          <Link to="/" className="inline-flex items-center">
            <span
              className={`font-serif font-semibold tracking-wide transition-all ${
                scrolled ? "text-xl" : "text-2xl md:text-3xl"
              }`}
            >
              The Halla
            </span>
          </Link>

          <form onSubmit={submitSearch} className="hidden md:flex items-center flex-1 max-w-sm relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 text-primary/50 text-sm" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search Products"
              className="w-full bg-white border border-border rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-accent"
            />
          </form>

          <div className="flex items-center gap-3">
            <button className="icon-btn md:hidden text-lg" onClick={() => setSearchOpen(true)} aria-label="Search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
            <Link to="/wishlist" className="icon-btn text-lg" aria-label="Wishlist">
              <i className="fa-regular fa-heart" />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="icon-btn text-lg" aria-label="Cart">
              <i className="fa-solid fa-bag-shopping" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="icon-btn text-2xl md:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </div>

        <nav className="hidden md:block border-t border-border mt-3 pt-2">
          <ul className="max-w-container mx-auto px-8 flex items-center gap-8 text-sm font-medium tracking-wide">
            <li>
              <Link to="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li className="relative group">
              <button className="hover:text-accent inline-flex items-center gap-1 py-2">
                Category <i className="fa-solid fa-chevron-down text-[10px]" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:grid grid-cols-2 gap-x-6 gap-y-1 bg-white shadow-xl rounded-lg p-4 w-72 z-50 border border-border">
                {categories.map((c) => (
                  <Link key={c._id} to={`/category/${c.slug}`} className="text-sm py-1 hover:text-accent whitespace-nowrap">
                    {c.name}
                  </Link>
                ))}
              </div>
            </li>
            {STATIC_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
