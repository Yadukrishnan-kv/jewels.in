import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "New Arrivals", to: "/search" },
  { label: "Contact", to: "/contactus" },
  { label: "About Us", to: "/about" },
  { label: "Track", to: "/track" },
];

export default function MobileMenu({ open, onClose, categories }) {
  const [catOpen, setCatOpen] = useState(false);

  return (
    <div
      className={`fixed inset-0 z-[160] md:hidden transition-opacity ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-secondary shadow-xl transition-transform duration-300 overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="icon-btn text-2xl" aria-label="Close menu">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <ul className="flex flex-col px-6 gap-1 pb-10">
          <li>
            <Link to="/" onClick={onClose} className="block py-3 border-b border-border font-medium">
              Home
            </Link>
          </li>
          <li className="border-b border-border">
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="w-full flex justify-between items-center py-3 font-medium"
            >
              Category
              <i className={`fa-solid fa-chevron-down transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all ${catOpen ? "max-h-[600px] pb-2" : "max-h-0"}`}>
              {categories.map((c) => (
                <Link
                  key={c._id}
                  to={`/category/${c.slug}`}
                  onClick={onClose}
                  className="block py-2 pl-3 text-sm text-primary/80 hover:text-accent"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </li>
          {NAV_LINKS.slice(1).map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={onClose} className="block py-3 border-b border-border font-medium">
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex gap-6 pt-4">
            <Link to="/wishlist" onClick={onClose} className="flex items-center gap-2 text-sm">
              <i className="fa-regular fa-heart" /> Wishlist
            </Link>
            <Link to="/cart" onClick={onClose} className="flex items-center gap-2 text-sm">
              <i className="fa-solid fa-bag-shopping" /> Cart
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
