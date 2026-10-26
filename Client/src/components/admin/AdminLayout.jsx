import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { adminApi, imageUrl } from "../../api/client.js";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: "fa-gauge-high", end: true }],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", label: "Products", icon: "fa-gem" },
      { to: "/admin/categories", label: "Categories", icon: "fa-layer-group" },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/banners", label: "Homepage CMS", icon: "fa-image" },
      { to: "/admin/pages", label: "Pages", icon: "fa-file-lines" },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/admin/orders", label: "Orders", icon: "fa-receipt", badgeKey: "pendingOrders" },
      { to: "/admin/inquiries", label: "Inquiries", icon: "fa-envelope", badgeKey: "newInquiries" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/settings", label: "Settings", icon: "fa-gear" },
      { to: "/admin/users", label: "Admin Users", icon: "fa-users-gear" },
    ],
  },
];

const FLAT_NAV = NAV_GROUPS.flatMap((g) => g.items);

function initialsOf(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "A";
}

function NavBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-auto text-[0.65rem] font-semibold min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function SidebarContent({ notifications, user, onLogout }) {
  return (
    <div className="h-full flex flex-col">
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white/30">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] transition-all duration-200 ${
                      isActive ? "bg-white/10 text-white font-medium" : "text-white/55 hover:bg-white/5 hover:text-white/85"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="admin-nav-active"
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-accent-light"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <i className={`fa-solid ${item.icon} w-4 text-center text-[0.85rem]`} />
                      <span className="truncate">{item.label}</span>
                      {item.badgeKey && <NavBadge count={notifications?.[item.badgeKey]} />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-accent/25 text-accent-light flex items-center justify-center text-xs font-semibold shrink-0">
            {initialsOf(user?.name || user?.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white/90 truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-white/35 capitalize">{user?.role}</p>
          </div>
          <button onClick={onLogout} aria-label="Logout" className="admin-icon-btn !text-white/50 hover:!text-white hover:!bg-white/10">
            <i className="fa-solid fa-arrow-right-from-bracket text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, token, logout } = useAdminAuth();
  const { settings } = useSiteData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    if (!token) return;
    function load() {
      adminApi.get("/notifications", token).then(setNotifications).catch(() => {});
    }
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [token]);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const current = [...FLAT_NAV].reverse().find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen flex bg-secondary text-primary font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-primary flex-col shrink-0 fixed inset-y-0 left-0">
        <div className="p-5 border-b border-white/10 flex items-center gap-2.5">
          {settings.logo ? (
            <img src={imageUrl(settings.logo)} alt={settings.siteName || "Store"} className="h-7 w-auto object-contain brightness-0 invert" />
          ) : (
            <span className="font-serif text-lg text-white">{settings.siteName || "Store"}</span>
          )}
          <span className="text-[0.6rem] font-semibold tracking-wider uppercase text-white/35 bg-white/10 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <SidebarContent notifications={notifications} user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-[90] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-72 bg-primary flex flex-col z-[100] lg:hidden"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <span className="font-serif text-lg text-white">{settings.siteName || "Store"}</span>
                <button onClick={() => setMobileOpen(false)} className="admin-icon-btn !text-white/60 hover:!text-white hover:!bg-white/10" aria-label="Close menu">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <SidebarContent notifications={notifications} user={user} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="sticky top-0 z-[80] bg-white/90 backdrop-blur-xl border-b border-border px-4 md:px-8 py-3.5 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="admin-icon-btn lg:hidden" aria-label="Open menu">
              <i className="fa-solid fa-bars" />
            </button>
            <p className="text-sm font-medium text-primary/70 truncate">{current?.label || "Admin"}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex admin-btn-ghost admin-btn-sm"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" /> View live site
            </a>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold hover:bg-accent/20 transition-colors"
              >
                {initialsOf(user?.name || user?.email)}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-56 admin-card p-2 shadow-elevated"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-medium text-primary truncate">{user?.name}</p>
                      <p className="text-xs text-primary/45 truncate">{user?.email}</p>
                    </div>
                    <a href="/" target="_blank" rel="noreferrer" className="sm:hidden flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary/70 hover:bg-secondary">
                      <i className="fa-solid fa-arrow-up-right-from-square w-4 text-center" /> View live site
                    </a>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50">
                      <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet context={{ notifications }} />
        </main>
      </div>
    </div>
  );
}
