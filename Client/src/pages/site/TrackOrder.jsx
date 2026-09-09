import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client.js";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

function formatPrice(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function TrackOrder() {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("orderNumber") || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const data = await api.get(`/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
      <div className="bg-white border border-border rounded-2xl p-6 md:p-10 text-center">
        <h1 className="font-serif text-2xl md:text-3xl mb-2">Track Your Package</h1>
        <p className="text-primary/60 mb-8">Enter your order number and phone number to check delivery status.</p>

        <form onSubmit={handleSubmit} className="space-y-3 text-left max-w-md mx-auto">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Order number e.g. HJ123456789"
            required
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Phone number used at checkout"
            required
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            <i className="fa-solid fa-search" /> {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        {order && (
          <div className="mt-8 text-left border-t border-border pt-6">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">{order.orderNumber}</span>
              <span className="text-sm text-primary/60">{formatPrice(order.total)}</span>
            </div>

            {order.status === "cancelled" ? (
              <p className="text-red-600 text-sm font-medium">This order was cancelled.</p>
            ) : (
              <div className="flex justify-between mb-6">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center relative">
                    {i > 0 && (
                      <div
                        className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= stepIndex ? "bg-accent" : "bg-border"}`}
                      />
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] z-10 ${
                        i <= stepIndex ? "bg-accent text-white" : "bg-border text-primary/50"
                      }`}
                    >
                      {i <= stepIndex ? <i className="fa-solid fa-check" /> : i + 1}
                    </div>
                    <span className="text-[10px] mt-1 capitalize text-center">{s}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 text-sm">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between text-primary/70">
                  <span>
                    {it.name} x{it.qty}
                  </span>
                  <span>{formatPrice(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-left bg-secondary rounded-lg p-4 text-xs text-primary/60 space-y-1">
          <p className="font-semibold text-primary mb-1">Need help?</p>
          <p>Your order number was shown on the confirmation page and sent via WhatsApp.</p>
          <p>Use the exact phone number you entered at checkout.</p>
        </div>
      </div>
    </div>
  );
}
