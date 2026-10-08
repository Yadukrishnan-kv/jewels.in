import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api, imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { formatPrice } from "../../utils/currency.js";

const EMPTY_FORM = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

function Field({ error, children }) {
  return (
    <div>
      {children}
      {error && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation" />{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
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
      const { order, whatsappNumber } = await api.post("/orders", payload);

      let text = `*New Order - ${order.orderNumber}*%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AAddress: ${form.address}, ${form.city} ${form.state} ${form.pincode}%0A%0AItems:%0A`;
      items.forEach((i) => {
        text += `- ${i.name} (${i.variantLabel}) x${i.qty} = ${formatPrice(i.price * i.qty)}%0A`;
      });
      text += `%0ATotal: ${formatPrice(subtotal)}`;

      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
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
      <div className="max-w-container mx-auto px-4 md:px-8 py-28 text-center">
        <i className="fa-solid fa-cart-arrow-down text-3xl mb-4 block text-primary/25" />
        <p className="text-primary/55 mb-6">Your cart is empty — add something before checking out.</p>
        <Link to="/search" className="btn-accent">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <div className="max-w-container mx-auto px-4 md:px-8 pb-16">
        <h1 className="section-title">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <Reveal direction="left" as="form" onSubmit={handleSubmit} className="flex-[2] surface-card p-6 md:p-8 space-y-5">
            <h3 className="font-serif text-lg font-medium flex items-center gap-2">
              <i className="fa-solid fa-truck text-accent text-sm" /> Delivery Details
            </h3>
            <Field error={errors.name}>
              <input
                placeholder="Your Full Name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full field"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field error={errors.phone}>
                <input
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="field"
                />
              </Field>
              <input
                placeholder="Email (optional)"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="field"
              />
            </div>
            <Field error={errors.address}>
              <textarea
                placeholder="Full Address"
                rows={3}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="field resize-none"
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field error={errors.city}>
                <input placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} className="field" />
              </Field>
              <input placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} className="field" />
              <Field error={errors.pincode}>
                <input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="field"
                />
              </Field>
            </div>

            <div className="bg-secondary rounded-2xl p-4 text-sm text-primary/70 flex gap-3 items-start">
              <i className="fa-brands fa-whatsapp text-[#25D366] text-lg mt-0.5" />
              <p>
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
                "Place Order via WhatsApp"
              )}
            </button>
          </Reveal>

          <Reveal direction="right" className="flex-1">
            <div className="surface-card p-5 md:p-6 sticky top-24">
              <h3 className="font-serif text-lg font-medium mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.key} className="flex gap-3 items-center text-sm">
                    <img src={imageUrl(i.image)} className="w-12 h-12 rounded-xl object-cover bg-secondary" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{i.name}</p>
                      <p className="text-xs text-primary/50">Qty {i.qty}</p>
                    </div>
                    <span className="font-medium">{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between py-3 mt-3 border-t border-border font-semibold">
                <span>Total</span>
                <span className="text-accent">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
