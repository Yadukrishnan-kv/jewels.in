import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api, imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import { formatPrice } from "../../utils/currency.js";

const EMPTY_FORM = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

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
      <div className="max-w-container mx-auto px-4 md:px-8 py-24 text-center">
        <p className="text-primary/60 mb-6">Your cart is empty — add something before checking out.</p>
        <Link to="/search" className="btn-primary">
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
          <form onSubmit={handleSubmit} className="flex-[2] space-y-4">
            <h3 className="font-semibold">Delivery Details</h3>
            <div>
              <input
                placeholder="Your Full Name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <input
                placeholder="Email (optional)"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <textarea
                placeholder="Full Address"
                rows={3}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
              />
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
                />
                {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
              </div>
              <input
                placeholder="State"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <div>
                <input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
                />
                {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-4 text-sm text-primary/70 flex gap-3 items-start">
              <i className="fa-brands fa-whatsapp text-[#25D366] text-lg mt-0.5" />
              <p>
                We don&apos;t take payment on the website. After you place your order, a WhatsApp chat opens with your
                order summary pre-filled — our team confirms payment (COD or UPI) and delivery there.
              </p>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
              {submitting ? "Placing order..." : "Place Order via WhatsApp"}
            </button>
          </form>

          <div className="flex-1">
            <div className="border border-border rounded-xl p-5 bg-white sticky top-24">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {items.map((i) => (
                  <div key={i.key} className="flex gap-3 items-center text-sm">
                    <img src={imageUrl(i.image)} className="w-12 h-12 rounded object-cover bg-secondary" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{i.name}</p>
                      <p className="text-xs text-primary/50">Qty {i.qty}</p>
                    </div>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between py-3 mt-3 border-t border-border font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
