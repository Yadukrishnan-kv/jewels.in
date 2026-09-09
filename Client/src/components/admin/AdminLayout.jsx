import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "fa-gauge", end: true },
  { to: "/admin/products", label: "Products", icon: "fa-gem" },
  { to: "/admin/categories", label: "Categories", icon: "fa-layer-group" },
  { to: "/admin/banners", label: "Homepage CMS", icon: "fa-image" },
  { to: "/admin/pages", label: "Pages", icon: "fa-file-lines" },
  { to: "/admin/orders", label: "Orders", icon: "fa-receipt" },
  { to: "/admin/inquiries", label: "Inquiries", icon: "fa-envelope" },
  { to: "/admin/settings", label: "Settings", icon: "fa-gear" },
  { to: "/admin/users", label: "Admin Users", icon: "fa-users-gear" },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-secondary text-primary font-sans">
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <span className="font-serif text-xl">The Halla</span>
          <p className="text-xs text-white/50">Admin CMS</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white font-medium" : "text-white/70 hover:bg-white/5"
                }`
              }
            >
              <i className={`fa-solid ${item.icon} w-4`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 truncate">{user?.email}</p>
          <p className="text-xs text-white/30 capitalize">{user?.role}</p>
          <button onClick={handleLogout} className="mt-3 text-sm text-white/80 hover:text-white flex items-center gap-2">
            <i className="fa-solid fa-arrow-right-from-bracket" /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-border px-8 py-4 flex justify-between items-center">
          <a href="/" target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline">
            <i className="fa-solid fa-arrow-up-right-from-square mr-1" /> View live site
          </a>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
