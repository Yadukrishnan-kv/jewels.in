import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatPrice } from "../../utils/currency.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Badge from "../../components/admin/Badge.jsx";
import { Select } from "../../components/admin/FormControls.jsx";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const TIMELINE_STEPS = ["pending", "confirmed", "shipped", "delivered"];
const STATUS_TONE = { pending: "warning", confirmed: "info", shipped: "accent", delivered: "success", cancelled: "danger" };

function OrderDrawer({ order, onClose, onStatusChange }) {
  const stepIndex = order ? TIMELINE_STEPS.indexOf(order.status) : -1;
  return (
    <AnimatePresence>
      {order && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-elevated"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-border px-6 py-5 flex items-start justify-between z-10">
              <div>
                <p className="text-xs text-primary/40">Order</p>
                <h3 className="font-semibold text-lg text-primary">{order.orderNumber}</h3>
                <p className="text-xs text-primary/40 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={onClose} className="admin-icon-btn" aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="admin-label">Order status</label>
                <Select value={order.status} onChange={(e) => onStatusChange(order._id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>

              {order.status === "cancelled" ? (
                <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm font-medium text-center">This order was cancelled.</div>
              ) : (
                <div className="flex justify-between">
                  {TIMELINE_STEPS.map((s, i) => (
                    <div key={s} className="flex-1 flex flex-col items-center relative">
                      {i > 0 && (
                        <div className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= stepIndex ? "bg-accent" : "bg-border"}`} />
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] z-10 ${
                          i <= stepIndex ? "bg-accent text-white" : "bg-border text-primary/40"
                        }`}
                      >
                        {i <= stepIndex ? <i className="fa-solid fa-check" /> : i + 1}
                      </div>
                      <span className="text-[10px] mt-1.5 capitalize text-primary/55 text-center">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="admin-label">Customer</p>
                  <p className="text-primary">{order.customer.name}</p>
                  <p className="text-primary/60">{order.customer.phone}</p>
                  {order.customer.email && <p className="text-primary/60 truncate">{order.customer.email}</p>}
                </div>
                <div>
                  <p className="admin-label">Delivery address</p>
                  <p className="text-primary/70">{order.customer.address}</p>
                  <p className="text-primary/70">
                    {order.customer.city}, {order.customer.state} {order.customer.pincode}
                  </p>
                </div>
              </div>

              <div>
                <p className="admin-label mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                      <span className="text-primary/75">
                        {it.name} <span className="text-primary/40">({it.variantLabel}) &times;{it.qty}</span>
                      </span>
                      <span className="font-medium text-primary">{formatPrice(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-semibold text-primary">Total</span>
                <span className="font-semibold text-lg text-accent">{formatPrice(order.total)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function OrdersAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  function load() {
    setLoading(true);
    adminApi
      .get(`/orders${statusFilter ? `?status=${statusFilter}` : ""}`, token)
      .then(setOrders)
      .finally(() => setLoading(false));
  }
  useEffect(load, [token, statusFilter]);

  async function updateStatus(id, status) {
    await adminApi.put(`/orders/${id}/status`, { status }, token);
    showToast("Order status updated");
    load();
    if (selected?._id === id) setSelected((s) => ({ ...s, status }));
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.trim().toLowerCase();
    return orders.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customer?.name?.toLowerCase().includes(q) || o.customer?.phone?.includes(q));
  }, [orders, search]);

  const counts = useMemo(() => {
    const c = { all: orders.length };
    STATUSES.forEach((s) => (c[s] = orders.filter((o) => o.status === s).length));
    return c;
  }, [orders]);

  const columns = [
    { key: "orderNumber", header: "Order #", render: (o) => <span className="font-medium text-primary">{o.orderNumber}</span> },
    {
      key: "customer",
      header: "Customer",
      render: (o) => (
        <div>
          <p className="text-primary/80">{o.customer?.name}</p>
          <p className="text-xs text-primary/40">{o.customer?.phone}</p>
        </div>
      ),
    },
    { key: "total", header: "Total", render: (o) => <span className="font-medium">{formatPrice(o.total)}</span> },
    {
      key: "status",
      header: "Status",
      render: (o) => (
        <Badge tone={STATUS_TONE[o.status]} dot>
          {o.status}
        </Badge>
      ),
    },
    { key: "date", header: "Date", render: (o) => <span className="text-primary/45 text-xs">{new Date(o.createdAt).toLocaleDateString()}</span> },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      render: (o) => (
        <button onClick={() => setSelected(o)} className="admin-btn-ghost admin-btn-sm">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"} placed`} />

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 text-sm" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order # or customer..." className="admin-input pl-10" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              statusFilter === "" ? "bg-primary text-white border-primary" : "border-border text-primary/55 hover:border-accent hover:text-accent"
            }`}
          >
            All ({counts.all})
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border capitalize transition-colors ${
                statusFilter === s ? "bg-primary text-white border-primary" : "border-border text-primary/55 hover:border-accent hover:text-accent"
              }`}
            >
              {s} ({counts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        onRowClick={setSelected}
        pageSize={10}
        empty={{ icon: "fa-receipt", title: "No orders found", message: "Orders placed through checkout will appear here." }}
      />

      <OrderDrawer order={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />
    </div>
  );
}
