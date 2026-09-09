import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";

const ITEMS = [
  { to: "/", label: "Home", icon: "fa-house" },
  { to: "/search", label: "Search", icon: "fa-magnifying-glass" },
  { to: "/track", label: "Track", icon: "fa-truck-fast" },
  { to: "/wishlist", label: "Wishlist", icon: "fa-heart", badgeKey: "wish" },
  { to: "/cart", label: "Cart", icon: "fa-bag-shopping", badgeKey: "cart" },
];

export default function MobileBottomNav() {
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const badges = { cart: cartCount, wish: wishCount };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[95] md:hidden bg-white border-t border-border flex justify-around py-2">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[11px] px-2 py-1 relative ${
              isActive ? "text-accent" : "text-primary/60"
            }`
          }
        >
          <i className={`fa-solid ${item.icon} text-lg relative`}>
            {item.badgeKey && badges[item.badgeKey] > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-sans">
                {badges[item.badgeKey]}
              </span>
            )}
          </i>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
