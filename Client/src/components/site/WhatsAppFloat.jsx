import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function WhatsAppFloat() {
  const { settings } = useSiteData();
  const number = settings.whatsappNumber || "910000000000";

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 md:right-6 bottom-20 md:bottom-6 z-[90] inline-flex items-center gap-2.5 rounded-[2px] bg-[#25D366] text-white text-[0.7rem] font-semibold uppercase tracking-[0.14em] px-4 py-3.5 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-card-hover"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-lg" />
      <span className="hidden xs:inline">Chat with us</span>
    </a>
  );
}
