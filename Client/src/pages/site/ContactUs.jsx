import { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { api } from "../../api/client.js";
import { useToast } from "../../context/ToastContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";

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
  const [openFaq, setOpenFaq] = useState(0);
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

  const mapsLink = settings.address ? `https://maps.google.com/?q=${encodeURIComponent(settings.address)}` : undefined;
  const mapEmbedSrc =
    settings.mapEmbedUrl ||
    `https://maps.google.com/maps?q=${encodeURIComponent(settings.address || "Calicut, Kerala, India")}&output=embed`;

  const infoRows = [
    {
      icon: "fa-solid fa-location-dot",
      title: "Our location",
      value: settings.address || "Calicut, Kerala",
      action: mapsLink && { label: "View on map", href: mapsLink },
    },
    {
      icon: "fa-solid fa-phone",
      title: "Call us",
      value: settings.contactPhone,
      action: settings.contactPhone && { label: "Call now", href: `tel:${settings.contactPhone}` },
    },
    {
      icon: "fa-solid fa-envelope",
      title: "Email us",
      value: settings.contactEmail,
      action: settings.contactEmail && { label: "Send email", href: `mailto:${settings.contactEmail}` },
    },
    {
      icon: "fa-brands fa-whatsapp",
      title: "WhatsApp",
      value: settings.whatsappNumber,
      action: { label: "Start chatting", href: `https://wa.me/${settings.whatsappNumber || "910000000000"}` },
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]} />

      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
          <span className="eyebrow">We&apos;d love to hear from you</span>
          <h1 className="section-title mt-4">{settings.sectionTitles?.contactPageTitle || "Get in Touch"}</h1>
          <p className="section-subtitle mt-4 text-[0.9rem] max-w-[600px]">
            {settings.sectionTitles?.contactPageSubtitle ||
              "Have questions? We're here to help. Contact us through any of the channels below or send us a message."}
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16">
          {/* Form */}
          <Reveal className="surface-card p-6 md:p-10">
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-border/60">
              <span className="micro text-accent tabular-nums">01</span>
              <h3 className="micro text-primary">Send us a message</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="field-label" htmlFor="c-name">Full name</label>
                <input
                  id="c-name"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="field"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="field-label" htmlFor="c-phone">Phone (optional)</label>
                  <input
                    id="c-phone"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-email">Email (optional)</label>
                  <input
                    id="c-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="field"
                  />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  required
                  rows={6}
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="field resize-y min-h-[140px]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#25D366] text-white rounded-[2px] micro py-4 px-8 flex items-center justify-center gap-2.5 transition-all duration-300 ease-premium hover:bg-[#128C7E] disabled:opacity-60"
              >
                <i className="fa-brands fa-whatsapp" /> Send via WhatsApp
              </button>
            </form>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.08}>
            <div className="border-t border-border/60">
              {infoRows.map((r) => (
                <div key={r.title} className="flex items-start gap-5 py-6 border-b border-border/60 group">
                  <div className="w-11 h-11 shrink-0 border border-border/70 bg-white flex items-center justify-center text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <i className={`${r.icon} text-[0.85rem]`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="micro text-primary/40 block mb-1.5">{r.title}</span>
                    <p className="text-[0.95rem] text-primary/80 break-words">{r.value || "—"}</p>
                  </div>
                  {r.action && (
                    <a
                      href={r.action.href}
                      target={r.action.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="micro text-primary/45 hover:text-accent transition-colors shrink-0 mt-1"
                    >
                      {r.action.label} <i className="fa-solid fa-arrow-right text-[0.55rem]" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal className="mt-14 md:mt-20 border border-border/60 overflow-hidden h-[300px] md:h-[420px] bg-white">
          <iframe src={mapEmbedSrc} className="w-full h-full border-0" loading="lazy" title="Map" />
        </Reveal>

        {/* FAQ */}
        <div className="mt-16 md:mt-24 max-w-3xl mx-auto">
          <Reveal className="mb-10">
            <span className="eyebrow">Answers</span>
            <h2 className="section-title mt-4">Frequently Asked Questions</h2>
          </Reveal>
          <div className="border-t border-border/60">
            {FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="border-b border-border/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`w-full flex justify-between items-center gap-5 py-5 text-left text-[0.95rem] font-medium transition-colors ${
                      openFaq === i ? "text-accent" : "text-primary hover:text-primary/70"
                    }`}
                    aria-expanded={openFaq === i}
                  >
                    {f.q}
                    <i
                      className={`fa-solid fa-chevron-down text-[0.65rem] shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-48 pb-6" : "max-h-0"}`}>
                    <p className="text-[0.88rem] text-primary/55 leading-[1.7] pr-8">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
