import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Modal from "../../components/admin/Modal.jsx";
import { formatPrice } from "../../utils/currency.js";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);

  function load() {
    adminApi.get(`/orders${statusFilter ? `?status=${statusFilter}` : ""}`, token).then(setOrders);
  }
  useEffect(load, [token, statusFilter]);

  async function updateStatus(id, status) {
    await adminApi.put(`/orders/${id}/status`, { status }, token);
    showToast("Order status updated");
    load();
    if (selected?._id === id) setSelected((s) => ({ ...s, status }));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-primary/50">No orders found.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-2">{o.customer?.name}</td>
                  <td className="px-4 py-2">{o.customer?.phone}</td>
                  <td className="px-4 py-2">{formatPrice(o.total)}</td>
                  <td className="px-4 py-2">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border border-border rounded-full px-2 py-1 text-xs capitalize"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-primary/50 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => setSelected(o)} className="text-accent text-xs hover:underline">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.orderNumber} wide>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-primary/50 text-xs">Customer</p>
                <p>{selected.customer.name}</p>
                <p>{selected.customer.phone}</p>
                <p>{selected.customer.email}</p>
              </div>
              <div>
                <p className="text-primary/50 text-xs">Address</p>
                <p>{selected.customer.address}</p>
                <p>{selected.customer.city}, {selected.customer.state} {selected.customer.pincode}</p>
              </div>
            </div>
            <div>
              <p className="text-primary/50 text-xs mb-2">Items</p>
              <div className="space-y-2">
                {selected.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-border pb-2">
                    <span>{it.name} ({it.variantLabel}) x{it.qty}</span>
                    <span>{formatPrice(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(selected.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
