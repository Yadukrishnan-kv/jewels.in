import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { formatPrice } from "../../utils/currency.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import Badge from "../../components/admin/Badge.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";
import TrendChart from "../../components/admin/TrendChart.jsx";
import { StatCardSkeleton } from "../../components/admin/Skeletons.jsx";

const STATUS_TONE = { pending: "warning", confirmed: "info", shipped: "accent", delivered: "success", cancelled: "danger" };

export default function Dashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.get("/dashboard", token).then(setStats);
  }, [token]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  if (!stats) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Loading your store's latest activity..." />
        <StatCardSkeleton />
      </div>
    );
  }

  const cards = [
    { label: "Products", value: stats.productCount, icon: "fa-gem", to: "/admin/products" },
    { label: "Categories", value: stats.categoryCount, icon: "fa-layer-group", to: "/admin/categories" },
    { label: "Orders", value: stats.orderCount, icon: "fa-receipt", to: "/admin/orders", tone: "success" },
    { label: "Revenue (non-cancelled)", value: formatPrice(stats.totalRevenue), icon: "fa-indian-rupee-sign", to: "/admin/orders", tone: "warning" },
  ];

  const statusEntries = Object.entries(stats.ordersByStatus);
  const maxStatus = Math.max(1, ...statusEntries.map(([, c]) => c));
  const periodRevenue = stats.revenueTrend.reduce((s, d) => s + d.revenue, 0);

  return (
    <div>
      <PageHeader eyebrow={greeting} title="Dashboard" subtitle="Here's what's happening across your store." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => (
          <StatCard key={c.label} {...c} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-primary">Revenue</h3>
                <p className="text-xs text-primary/45 mt-0.5">Last 14 days &middot; excludes cancelled orders</p>
              </div>
              <p className="text-lg font-semibold text-accent">{formatPrice(periodRevenue)}</p>
            </div>
            <TrendChart data={stats.revenueTrend} />
          </div>

          <div className="admin-card">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-primary">Recent Orders</h3>
              <Link to="/admin/orders" className="text-xs font-medium text-accent hover:underline">
                View all
              </Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <EmptyState icon="fa-receipt" title="No orders yet" message="New orders placed through checkout will show up here." />
            ) : (
              <div className="divide-y divide-border">
                {stats.recentOrders.map((o, i) => (
                  <motion.div
                    key={o._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between gap-4 px-5 md:px-6 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-primary truncate">{o.orderNumber}</p>
                      <p className="text-xs text-primary/45 truncate">{o.customer?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-primary">{formatPrice(o.total)}</p>
                      <Badge tone={STATUS_TONE[o.status]} dot className="mt-1">
                        {o.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-5 md:p-6">
            <h3 className="font-semibold text-primary mb-4">Orders by Status</h3>
            <div className="space-y-3">
              {statusEntries.map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize text-primary/60 font-medium">{status}</span>
                    <span className="text-primary/45">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxStatus) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${
                        status === "cancelled" ? "bg-red-400" : status === "delivered" ? "bg-emerald-400" : "bg-accent"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-primary">Low Stock Alerts</h3>
              {stats.lowStockProducts.length > 0 && <Badge tone="danger">{stats.lowStockProducts.length}</Badge>}
            </div>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-sm text-primary/45">All products are well stocked.</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((p) => (
                  <Link key={p._id} to={`/admin/products/${p._id}`} className="flex items-center gap-3 group">
                    <img src={imageUrl(p.image)} alt="" className="w-9 h-9 rounded-lg object-cover bg-secondary shrink-0" />
                    <p className="text-sm text-primary/80 truncate flex-1 group-hover:text-accent transition-colors">{p.name}</p>
                    <Badge tone={p.stock === 0 ? "danger" : "warning"}>{p.stock === 0 ? "Out" : `${p.stock} left`}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="admin-card p-5 md:p-6">
            <h3 className="font-semibold text-primary mb-4">Top Selling Products</h3>
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-primary/45">No sales data yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.map((p, i) => (
                  <div key={p.productId || i} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-primary/30">{i + 1}</span>
                    <img src={imageUrl(p.image)} alt="" className="w-9 h-9 rounded-lg object-cover bg-secondary shrink-0" />
                    <p className="text-sm text-primary/80 truncate flex-1">{p.name}</p>
                    <span className="text-xs font-medium text-primary/50">{p.qty} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
