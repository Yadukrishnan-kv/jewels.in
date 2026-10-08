import { useState } from "react";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { api } from "../../api/client.js";
import { useToast } from "../../context/ToastContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal, { RevealGroup, RevealItem } from "../../components/site/Reveal.jsx";

const FAQS = [
  { q: "How long does delivery take?", a: "Orders are processed within 1-2 business days and typically arrive in 3-7 business days depending on your location." },
  { q: "What payment methods do you accept?", a: "We currently confirm orders and payment (COD or UPI) directly over WhatsApp after checkout." },
  { q: "Can I return or exchange a product?", a: "Please reach out to us within 3 days of delivery via WhatsApp or email and we'll help sort it out." },
  { q: "Do you ship across India?", a: "Yes, we ship pan-India via trusted courier partners." },
  { q: "How do I track my order?", a: "Use the Track page with your order number and the phone number used at checkout." },
  { q: "Are the products tarnish-resistant?", a: "Yes, all our pieces use premium alloy with tarnish-resistant plating for everyday wear." },
];

const CARD_ICON =
  "w-16 h-16 mx-auto mb-6 rounded-full bg-accent/[0.08] text-accent flex items-center justify-center text-[1.6rem] transition-all duration-500 ease-premium group-hover:bg-accent group-hover:text-white group-hover:scale-110";
const CARD = "group surface-card-hover px-5 py-[30px] md:px-[30px] md:py-10 text-center";
const CARD_LINK =
  "inline-flex items-center gap-2 text-accent font-semibold text-[0.85rem] border border-accent/20 rounded-full px-5 py-2 transition-all duration-300 hover:bg-accent hover:text-white";

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

  const mapsLink = settings.address ? `https://maps.google.com/?q=${encodeURIComponent(settings.address)}` : undefined;
  const mapEmbedSrc =
    settings.mapEmbedUrl ||
    `https://maps.google.com/maps?q=${encodeURIComponent(settings.address || "Calicut, Kerala, India")}&output=embed`;

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]} />
      <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
        <Reveal className="text-center mb-12">
          <span className="eyebrow">We&apos;d love to hear from you</span>
          <h1 className="section-title mt-2 mb-5">{settings.sectionTitles?.contactPageTitle || "Get in Touch"}</h1>
          <p className="text-primary/45 text-[0.9rem] max-w-[600px] mx-auto">
            {settings.sectionTitles?.contactPageSubtitle ||
              "Have questions? We're here to help. Contact us through any of the channels below or send us a message."}
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mb-[60px]" stagger={0.1}>
          <RevealItem>
            <div className={CARD}>
              <div className={CARD_ICON}>
                <i className="fa-solid fa-map-marker-alt" />
              </div>
              <h3 className="font-serif text-[1.3rem] font-medium mb-[15px]">Our Location</h3>
              <p className="text-[0.9rem] text-primary/55 leading-[1.5] mb-5">{settings.address || "Calicut, Kerala"}</p>
              {mapsLink && (
                <a href={mapsLink} target="_blank" rel="noreferrer" className={CARD_LINK}>
                  <i className="fa-solid fa-arrow-up-right-from-square" /> View on Map
                </a>
              )}
            </div>
          </RevealItem>
          <RevealItem>
            <div className={CARD}>
              <div className={CARD_ICON}>
                <i className="fa-solid fa-phone-alt" />
              </div>
              <h3 className="font-serif text-[1.3rem] font-medium mb-[15px]">Call Us</h3>
              <p className="text-[0.9rem] text-primary/55 leading-[1.5] mb-5">{settings.contactPhone}</p>
              {settings.contactPhone && (
                <a href={`tel:${settings.contactPhone}`} className={CARD_LINK}>
                  <i className="fa-solid fa-phone" /> Call Now
                </a>
              )}
            </div>
          </RevealItem>
          <RevealItem>
            <div className={CARD}>
              <div className={CARD_ICON}>
                <i className="fa-solid fa-envelope" />
              </div>
              <h3 className="font-serif text-[1.3rem] font-medium mb-[15px]">Email Us</h3>
              <p className="text-[0.9rem] text-primary/55 leading-[1.5] mb-5">{settings.contactEmail}</p>
              {settings.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} className={CARD_LINK}>
                  <i className="fa-solid fa-paper-plane" /> Send Email
                </a>
              )}
            </div>
          </RevealItem>
        </RevealGroup>

        <Reveal className="surface-card max-w-[800px] mx-auto px-5 py-[30px] md:p-[50px] mb-[60px]">
          <h3 className="relative text-center font-serif text-[1.5rem] font-medium pb-4 mb-10">
            Send us a Message
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[50px] h-[2px] bg-accent" />
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              required
              placeholder="Your Full Name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="field-pill"
            />
            <input
              placeholder="Your Phone Number (optional)"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="field-pill"
            />
            <input
              type="email"
              placeholder="Your Email Address (optional)"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="field-pill"
            />
            <textarea
              required
              rows={5}
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className="field rounded-3xl resize-y min-h-[140px]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#25D366] text-white rounded-full py-[14px] px-[30px] font-semibold text-[1rem] flex items-center justify-center gap-[10px] transition-all duration-300 ease-premium hover:bg-[#128C7E] hover:-translate-y-0.5 hover:shadow-card"
            >
              <i className="fa-brands fa-whatsapp" /> Send via WhatsApp
            </button>
          </form>
        </Reveal>

        <Reveal className="rounded-[28px] overflow-hidden shadow-card border border-border/70 mb-[60px] h-[300px] md:h-[400px]">
          <iframe src={mapEmbedSrc} className="w-full h-full border-0" loading="lazy" title="Map" />
        </Reveal>

        <div className="mb-10">
          <Reveal>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-5" stagger={0.06}>
            {FAQS.map((f, i) => (
              <RevealItem key={i}>
                <div className="bg-white border border-border/70 rounded-[20px] shadow-soft overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`w-full flex justify-between items-center gap-4 px-6 py-5 text-left text-[0.95rem] font-semibold transition-colors ${
                      openFaq === i ? "text-accent" : "text-primary"
                    }`}
                  >
                    {f.q}
                    <i className={`fa-solid fa-chevron-down text-xs shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden px-6 transition-all duration-300 ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                    <p className="text-[0.85rem] text-primary/55 leading-[1.6]">{f.a}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </div>
  );
}
