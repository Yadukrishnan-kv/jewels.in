import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function MobileBottomNav() {
  const { user } = useAuth();
  const ITEMS = [
    { to: "/", label: "Home", icon: "fa-house" },
    { to: "/search", label: "Search", icon: "fa-magnifying-glass" },
    { to: "/wishlist", label: "Saved", icon: "fa-heart" },
    { to: "/cart", label: "Cart", icon: "fa-bag-shopping" },
    { to: user ? "/account" : "/login", label: user ? "Account" : "Login", icon: "fa-user" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[95] md:hidden bg-secondary/95 backdrop-blur-xl border-t border-border/70 flex justify-around pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] px-2 py-1.5 transition-colors ${
              isActive ? "text-accent" : "text-primary/45"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute -top-2 w-5 h-[2px] bg-accent" />}
              <i className={`fa-solid ${item.icon} text-[1rem] relative`} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
