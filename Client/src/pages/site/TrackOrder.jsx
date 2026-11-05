import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import { userApi } from "../../api/client.js";
import { formatPrice } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

export default function TrackOrder() {
  const { settings } = useSiteData();
  const { token } = useAuth();
  const titles = settings.sectionTitles || {};
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    userApi
      .get("/orders/mine", token)
      .then((data) => {
        if (!active) return;
        setOrders(data || []);
        setSelected(data?.[0] || null);
      })
      .catch((err) => active && setError(err.message || "Could not load your orders"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  const stepIndex = selected ? STATUS_STEPS.indexOf(selected.status) : -1;

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Orders" }]} />

      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
          <span className="eyebrow">Order status</span>
          <h1 className="section-title mt-4">{titles.trackPageTitle || "My Orders"}</h1>
          <p className="section-subtitle mt-4 text-[0.9rem]">
            {titles.trackPageSubtitle || "View the status and details of every order you've placed."}
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-16">
        {loading ? (
          <p className="text-center text-primary/50 py-20">Loading your orders...</p>
        ) : error ? (
          <p className="max-w-lg mx-auto border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-[0.85rem] text-center">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <Reveal className="text-center border border-border/60 bg-white py-16 md:py-24 px-6 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 border border-border/70 text-primary/25 flex items-center justify-center text-xl">
              <i className="fa-solid fa-box" />
            </div>
            <p className="micro text-primary/35 mb-3">No orders yet</p>
            <h3 className="font-serif text-2xl mb-3">You haven&apos;t placed any orders</h3>
            <p className="text-[0.9rem] text-primary/50 mb-8">Start shopping and your orders will appear here.</p>
            <Link to="/search" className="btn-accent">
              Start shopping <i className="fa-solid fa-arrow-right text-[0.6rem]" />
            </Link>
          </Reveal>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
            <Reveal className="surface-card p-6 md:p-9">
              <h3 className="micro text-primary pb-4 mb-5 border-b border-primary/15">Your orders ({orders.length})</h3>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {orders.map((o) => (
                  <button
                    key={o._id}
                    onClick={() => setSelected(o)}
                    className={`w-full text-left px-4 py-3.5 border transition-colors duration-200 ${
                      selected?._id === o._id ? "border-accent bg-accent/5" : "border-border/60 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="font-serif text-[1.05rem] tabular-nums">{o.orderNumber}</span>
                      <span className="micro capitalize text-primary/50">{o.status}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[0.78rem] text-primary/40">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-[0.85rem] font-semibold tabular-nums">{formatPrice(o.total)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>

            <div>
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="surface-card p-6 md:p-9"
                  >
                    <div className="flex justify-between items-start pb-5 mb-6 border-b border-primary/15">
                      <div>
                        <span className="micro text-primary/40 block mb-1">Order</span>
                        <span className="font-serif text-[1.3rem] tabular-nums">{selected.orderNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="micro text-primary/40 block mb-1">Total</span>
                        <span className="font-semibold tabular-nums">{formatPrice(selected.total)}</span>
                      </div>
                    </div>

                    {selected.status === "cancelled" ? (
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
                        {selected.items.map((it, i) => (
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
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
