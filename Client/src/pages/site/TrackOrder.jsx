import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../../api/client.js";
import { formatPrice } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
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
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Track Order" }]} />

      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
          <span className="eyebrow">Order status</span>
          <h1 className="section-title mt-4">{titles.trackPageTitle || "Track Your Package"}</h1>
          <p className="section-subtitle mt-4 text-[0.9rem]">
            {titles.trackPageSubtitle || "Enter your order number and phone number to check your delivery status."}
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
          <Reveal className="surface-card p-6 md:p-9">
            <h3 className="micro text-primary pb-4 mb-7 border-b border-primary/15">Find your order</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="orderNumber" className="field-label">
                  Order number
                </label>
                <input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., HJ123456789"
                  autoComplete="off"
                  required
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="phone" className="field-label">
                  Phone number
                </label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="The number used at checkout"
                  autoComplete="off"
                  required
                  className="field"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-accent mt-1 justify-center">
                <i className={loading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-magnifying-glass"} />{" "}
                {loading ? "Searching..." : "Track order"}
              </button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-[0.82rem] mt-5 flex items-center gap-2"
                >
                  <i className="fa-solid fa-circle-exclamation text-[0.7rem]" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-8 bg-secondary/70 border border-border/60 p-5">
              <h4 className="flex items-center gap-2.5 micro text-primary/70 mb-3">
                <i className="fa-regular fa-circle-question text-accent" />
                Where can I find my order number?
              </h4>
              <ul className="space-y-2">
                <li className="text-[0.82rem] text-primary/55 flex gap-2.5">
                  <span className="w-1 h-1 bg-accent/60 rotate-45 mt-2 shrink-0" />
                  Check the WhatsApp chat opened during checkout
                </li>
                <li className="text-[0.82rem] text-primary/55 flex gap-2.5">
                  <span className="w-1 h-1 bg-accent/60 rotate-45 mt-2 shrink-0" />
                  Use the exact phone number entered at checkout
                </li>
                <li className="text-[0.82rem] text-primary/55 flex gap-2.5">
                  <span className="w-1 h-1 bg-accent/60 rotate-45 mt-2 shrink-0" />
                  Still stuck? Contact us and we&apos;ll look it up for you
                </li>
              </ul>
            </div>
          </Reveal>

          <div>
            <AnimatePresence mode="wait">
              {order ? (
                <motion.div
                  key={order.orderNumber}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="surface-card p-6 md:p-9"
                >
                  <div className="flex justify-between items-start pb-5 mb-6 border-b border-primary/15">
                    <div>
                      <span className="micro text-primary/40 block mb-1">Order</span>
                      <span className="font-serif text-[1.3rem] tabular-nums">{order.orderNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="micro text-primary/40 block mb-1">Total</span>
                      <span className="font-semibold tabular-nums">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {order.status === "cancelled" ? (
                    <p className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-[0.85rem] text-center font-medium mb-6">
                      This order was cancelled.
                    </p>
                  ) : (
                    <div className="flex justify-between mb-9">
                      {STATUS_STEPS.map((s, i) => (
                        <div key={s} className="flex-1 flex flex-col items-center relative">
                          {i > 0 && (
                            <div
                              className={`absolute top-3 right-1/2 w-full h-px transition-colors duration-500 ${
                                i <= stepIndex ? "bg-accent" : "bg-border"
                              }`}
                            />
                          )}
                          <div
                            className={`w-6 h-6 flex items-center justify-center text-[9px] z-10 transition-colors duration-500 ${
                              i <= stepIndex ? "bg-accent text-white" : "bg-border/70 text-primary/40"
                            }`}
                          >
                            {i <= stepIndex ? <i className="fa-solid fa-check" /> : i + 1}
                          </div>
                          <span className="micro mt-2 capitalize text-center text-[0.58rem] text-primary/50">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-border/60 pt-5">
                    <span className="micro text-primary/40 block mb-4">Items</span>
                    <div className="space-y-3 text-[0.88rem]">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-primary/70 gap-4">
                          <span className="truncate">
                            {it.name} <span className="text-primary/35">×{it.qty}</span>
                          </span>
                          <span className="tabular-nums shrink-0">{formatPrice(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="border border-dashed border-border/80 bg-white/40 h-full min-h-[320px] flex flex-col items-center justify-center text-center px-8">
                  <div className="w-14 h-14 border border-border/70 text-primary/25 flex items-center justify-center mb-5">
                    <i className="fa-solid fa-box" />
                  </div>
                  <p className="micro text-primary/35 mb-2">No order loaded</p>
                  <p className="text-[0.9rem] text-primary/50 max-w-xs leading-relaxed">
                    Enter your order details to see live status, items and totals here.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
