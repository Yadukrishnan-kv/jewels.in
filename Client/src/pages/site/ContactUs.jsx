import { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { api } from "../../api/client.js";
import { useToast } from "../../context/ToastContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";

const FAQS = [
  { q: "How long does delivery take?", a: "Orders are processed within 1-2 business days and typically arrive in 3-7 business days depending on your location." },
  { q: "What payment methods do you accept?", a: "We currently confirm orders and payment (COD or UPI) directly over WhatsApp after checkout." },
  { q: "Can I return or exchange a product?", a: "Please reach out to us within 3 days of delivery via WhatsApp or email and we'll help sort it out." },
  { q: "Do you ship across India?", a: "Yes, we ship pan-India via trusted courier partners." },
  { q: "How do I track my order?", a: "Use the Track page with your order number and the phone number used at checkout." },
  { q: "Are the products tarnish-resistant?", a: "Yes, all our pieces use premium alloy with tarnish-resistant plating for everyday wear." },
];

export default function ContactUs() {
  const { settings } = useSiteData();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSubmitting(true);
    try {
      await api.post("/inquiries", form);
    } catch {
      // still proceed to WhatsApp even if logging the inquiry fails
    }
    let text = `*New Contact Inquiry*%0A%0AName: ${form.name}%0A`;
    if (form.phone) text += `Phone: ${form.phone}%0A`;
    if (form.email) text += `Email: ${form.email}%0A`;
    text += `%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${settings.whatsappNumber || "910000000000"}?text=${text}`, "_blank");
    showToast("Opening WhatsApp with your message...");
    setForm({ name: "", phone: "", email: "", message: "" });
    setSubmitting(false);
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]} />
      <div className="max-w-container mx-auto px-4 md:px-8 pb-16">
        <div className="text-center mb-10">
          <h1 className="font-serif text-2xl md:text-3xl mb-2">Get In Touch</h1>
          <p className="text-primary/60">We&apos;d love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white border border-border rounded-2xl p-6 text-center">
            <i className="fa-solid fa-location-dot text-2xl text-accent mb-3 block" />
            <h3 className="font-semibold mb-1">Location</h3>
            <p className="text-sm text-primary/60">{settings.address || "Calicut, Kerala"}</p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-6 text-center">
            <i className="fa-solid fa-phone text-2xl text-accent mb-3 block" />
            <h3 className="font-semibold mb-1">Call</h3>
            <p className="text-sm text-primary/60">{settings.contactPhone}</p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-6 text-center">
            <i className="fa-solid fa-envelope text-2xl text-accent mb-3 block" />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-primary/60">{settings.contactEmail}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 mb-16">
          <input
            required
            placeholder="Your Full Name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            placeholder="Your Phone Number (optional)"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            type="email"
            placeholder="Your Email Address (optional)"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <textarea
            required
            rows={5}
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button type="submit" disabled={submitting} className="w-full bg-[#25D366] text-white rounded-full py-3 font-medium flex items-center justify-center gap-2 hover:opacity-90">
            <i className="fa-brands fa-whatsapp text-lg" /> Send via WhatsApp
          </button>
        </form>

        {settings.mapEmbedUrl && (
          <div className="mb-16 rounded-2xl overflow-hidden aspect-video max-w-3xl mx-auto">
            <iframe src={settings.mapEmbedUrl} className="w-full h-full border-0" loading="lazy" title="Map" />
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium"
                >
                  {f.q}
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all ${openFaq === i ? "max-h-40" : "max-h-0"}`}>
                  <p className="px-4 pb-4 text-sm text-primary/60">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
