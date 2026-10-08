import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../../api/client.js";
import { formatPrice } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Reveal from "../../components/site/Reveal.jsx";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

export default function TrackOrder() {
  const { settings } = useSiteData();
  const titles = settings.sectionTitles || {};
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
    <div className="max-w-[800px] mx-auto my-12 md:my-[60px] px-6">
      <Reveal className="surface-card px-6 py-8 md:px-10 md:py-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center shadow-glow">
          <i className="fa-solid fa-truck-fast text-white text-[1.6rem]" />
        </div>
        <h2 className="font-serif text-[1.3rem] md:text-2xl lg:text-[1.8rem] font-normal mb-3">
          {titles.trackPageTitle || "Track Your Package"}
        </h2>
        <p className="text-primary/50 text-[0.9rem] mb-8">
          {titles.trackPageSubtitle || "Enter your order number and phone number to check your delivery status."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left max-w-md mx-auto">
          <div className="flex flex-col gap-2">
            <label htmlFor="orderNumber" className="font-semibold text-[0.85rem] tracking-[0.5px]">
              Order Number
            </label>
            <input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., HJ123456789"
              autoComplete="off"
              required
              className="field-pill"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-semibold text-[0.85rem] tracking-[0.5px]">
              Phone Number
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="The number used at checkout"
              autoComplete="off"
              required
              className="field-pill"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-accent mt-2 justify-center">
            <i className={loading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-search"} /> {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 text-red-700 rounded-full px-5 py-3 text-[0.85rem] mt-5 max-w-md mx-auto"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-left border-t border-border pt-6 max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">{order.orderNumber}</span>
                <span className="text-[0.9rem] text-primary/55">{formatPrice(order.total)}</span>
              </div>

              {order.status === "cancelled" ? (
                <p className="bg-red-50 text-red-700 rounded-full px-5 py-3 text-[0.85rem] text-center font-medium mb-6">
                  This order was cancelled.
                </p>
              ) : (
                <div className="flex justify-between mb-8">
                  {STATUS_STEPS.map((s, i) => (
                    <div key={s} className="flex-1 flex flex-col items-center relative">
                      {i > 0 && (
                        <div className={`absolute top-3 right-1/2 w-full h-0.5 transition-colors duration-500 ${i <= stepIndex ? "bg-accent" : "bg-border"}`} />
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] z-10 transition-colors duration-500 ${
                          i <= stepIndex ? "bg-accent text-white" : "bg-border text-primary/50"
                        }`}
                      >
                        {i <= stepIndex ? <i className="fa-solid fa-check" /> : i + 1}
                      </div>
                      <span className="text-[10px] mt-1.5 capitalize text-center">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 text-[0.9rem]">
                {order.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-primary/70">
                    <span>
                      {it.name} x{it.qty}
                    </span>
                    <span>{formatPrice(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-left bg-secondary rounded-2xl p-5">
          <h4 className="flex items-center gap-2 font-semibold text-[0.9rem] mb-3">
            <i className="fa-regular fa-circle-question" />
            Where can I find my order number?
          </h4>
          <p className="text-[0.85rem] text-primary/60 leading-[1.5]">
            Your order number was shown on the confirmation page right after checkout and sent to you via WhatsApp.
          </p>
          <ul className="mt-2.5 pl-5 list-disc space-y-1.5">
            <li className="text-[0.85rem] text-primary/60">Check the WhatsApp chat opened during checkout</li>
            <li className="text-[0.85rem] text-primary/60">Use the exact phone number entered at checkout</li>
            <li className="text-[0.85rem] text-primary/60">Still stuck? Contact us and we&apos;ll look it up for you</li>
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
