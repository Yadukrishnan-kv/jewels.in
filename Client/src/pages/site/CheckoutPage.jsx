import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { userApi, imageUrl } from "../../api/client.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { formatPrice } from "../../utils/currency.js";

const EMPTY_FORM = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

function Field({ label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
          <i className="fa-solid fa-circle-exclamation text-[0.65rem]" />
          {error}
        </p>
      )}
    </div>
  );
}

function StepIndex({ current }) {
  const steps = ["Contact", "Delivery", "Confirm"];
  return (
    <div className="flex items-center gap-3 md:gap-5">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3 md:gap-5">
          <span className="flex items-center gap-2.5">
            <span
              className={`w-6 h-6 flex items-center justify-center micro tabular-nums ${
                i <= current ? "bg-accent text-white" : "bg-primary/10 text-primary/40"
              }`}
            >
              {i + 1}
            </span>
            <span className={`micro hidden sm:inline ${i <= current ? "text-primary" : "text-primary/35"}`}>{s}</span>
          </span>
          {i < steps.length - 1 && <span className="w-6 md:w-12 h-px bg-border/70" />}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const { settings } = useSiteData();
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        customer: form,
        items: items.map((i) => ({
          product: i.productId,
          name: i.name,
          image: i.image,
          variantLabel: i.variantLabel,
          price: i.price,
          qty: i.qty,
        })),
      };
      const { order, whatsappNumber } = await userApi.post("/orders", payload, token);

      const siteName = settings.siteName || "Store";
      const itemLines = items
        .map((i) => `• ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} ×${i.qty} — ${formatPrice(i.price * i.qty)}`)
        .join("\n");
      const text = [
        `🛍️ *New Order from ${siteName}!*`,
        `Order ID: *${order.orderNumber}*`,
        ``,
        `Hi, I'd like to confirm my order 💛`,
        ``,
        `👤 *Name:* ${form.name}`,
        `📞 *Phone:* ${form.phone}`,
        `📍 *Address:* ${form.address}, ${form.city} ${form.state} ${form.pincode}`,
        ``,
        `🧾 *Order Summary*`,
        itemLines,
        ``,
        `💰 *Total: ${formatPrice(subtotal)}*`,
        ``,
        `Looking forward to receiving my order soon! ✨`,
      ].join("\n");

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
      clearCart();
      navigate(`/order-confirmation/${order.orderNumber}`);
    } catch (err) {
      showToast(err.message || "Could not place order", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-5 md:px-8 py-28 text-center">
        <div className="w-16 h-16 mx-auto mb-6 border border-border/70 text-primary/25 flex items-center justify-center text-xl">
          <i className="fa-solid fa-cart-arrow-down" />
        </div>
        <p className="micro text-primary/35 mb-3">Nothing to check out</p>
        <p className="text-primary/55 mb-8">Your cart is empty — add something before checking out.</p>
        <Link to="/search" className="btn-accent">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />

      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Almost there</span>
            <h1 className="section-title mt-4">Checkout</h1>
          </div>
          <StepIndex current={1} />
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <Reveal direction="left" as="form" onSubmit={handleSubmit} className="flex-[1.9] surface-card p-6 md:p-10">
            {/* Contact */}
            <div className="flex items-center gap-3 pb-5 mb-7 border-b border-border/60">
              <span className="micro text-accent tabular-nums">01</span>
              <h3 className="micro text-primary">Contact details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full name" error={errors.name}>
                <input
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="field"
                />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <input
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="field"
                />
              </Field>
              <Field label="Email (optional)" className="md:col-span-2">
                <input
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="field"
                />
              </Field>
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-3 pb-5 mb-7 mt-10 border-b border-border/60">
              <span className="micro text-accent tabular-nums">02</span>
              <h3 className="micro text-primary">Delivery address</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Full address" error={errors.address} className="md:col-span-3">
                <textarea
                  placeholder="House / street / landmark"
                  rows={3}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className="field resize-none"
                />
              </Field>
              <Field label="City" error={errors.city}>
                <input placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} className="field" />
              </Field>
              <Field label="State">
                <input placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} className="field" />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="field"
                />
              </Field>
            </div>

            {/* Confirm */}
            <div className="flex items-center gap-3 pb-5 mb-5 mt-10 border-b border-border/60">
              <span className="micro text-accent tabular-nums">03</span>
              <h3 className="micro text-primary">Confirm order</h3>
            </div>
            <div className="flex gap-3.5 items-start bg-secondary/70 border border-border/60 p-4 mb-7">
              <i className="fa-brands fa-whatsapp text-[#128C7E] text-lg mt-0.5" />
              <p className="text-[0.85rem] leading-relaxed text-primary/65">
                We don&apos;t take payment on the website. After you place your order, a WhatsApp chat opens with your
                order summary pre-filled — our team confirms payment (COD or UPI) and delivery there.
              </p>
            </div>

            <button type="submit" disabled={submitting} className="btn-accent w-full justify-center">
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Placing order...
                </>
              ) : (
                <>
                  Place order via WhatsApp <i className="fa-solid fa-arrow-right text-[0.6rem]" />
                </>
              )}
            </button>
          </Reveal>

          <Reveal direction="right" className="flex-1 min-w-[280px]">
            <div className="surface-card p-6 md:p-7 lg:sticky lg:top-[92px]">
              <h3 className="micro text-primary pb-4 border-b border-primary/15">Your order</h3>
              <div className="space-y-4 py-5 max-h-80 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.key} className="flex gap-3.5 items-center text-sm">
                    <div className="w-14 h-14 shrink-0 bg-[#ebe6dc] overflow-hidden">
                      <img src={imageUrl(i.image)} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[0.85rem] font-medium">{i.name}</p>
                      <p className="micro text-primary/40 mt-0.5">
                        {i.variantLabel} · Qty {i.qty}
                      </p>
                    </div>
                    <span className="text-[0.85rem] font-semibold tabular-nums">{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline py-4 border-t border-border/60">
                <span className="micro text-primary/55">Total</span>
                <span className="text-[1.25rem] font-semibold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
