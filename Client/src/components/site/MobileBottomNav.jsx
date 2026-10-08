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
    <nav className="fixed bottom-0 left-0 right-0 z-[95] md:hidden bg-white/90 backdrop-blur-xl border-t border-border/70 flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10.5px] font-medium px-3 py-1.5 relative rounded-xl transition-colors ${
              isActive ? "text-accent" : "text-primary/55"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute -top-2 w-1 h-1 rounded-full bg-accent" />}
              <i className={`fa-solid ${item.icon} text-[1.05rem] relative`}>
                {item.badgeKey && badges[item.badgeKey] > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-accent text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-sans">
                    {badges[item.badgeKey]}
                  </span>
                )}
              </i>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
