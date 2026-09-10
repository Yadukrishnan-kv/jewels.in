import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { formatPrice } from "../../utils/currency.js";

export default function Dashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.get("/dashboard", token).then(setStats);
  }, [token]);

  if (!stats) return <div className="text-primary/60">Loading dashboard...</div>;

  const cards = [
    { label: "Products", value: stats.productCount, icon: "fa-gem", to: "/admin/products" },
    { label: "Categories", value: stats.categoryCount, icon: "fa-layer-group", to: "/admin/categories" },
    { label: "Orders", value: stats.orderCount, icon: "fa-receipt", to: "/admin/orders" },
    { label: "Revenue (non-cancelled)", value: formatPrice(stats.totalRevenue), icon: "fa-indian-rupee-sign", to: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <i className={`fa-solid ${c.icon} text-accent text-xl mb-3 block`} />
            <p className="text-2xl font-semibold">{c.value}</p>
            <p className="text-sm text-primary/60">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Orders by Status</h3>
          <div className="space-y-2">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                <span className="capitalize text-primary/70">{status}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-primary/50">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((o) => (
                <div key={o._id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-primary/50">{o.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p>{formatPrice(o.total)}</p>
                    <span className="text-xs capitalize text-accent">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
