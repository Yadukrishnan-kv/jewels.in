import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function WhatsAppFloat() {
  const { settings } = useSiteData();
  const number = settings.whatsappNumber || "910000000000";

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="fixed right-[30px] bottom-20 md:bottom-[30px] z-[90] inline-flex items-center gap-[10px] rounded-full bg-[#25D366] text-white text-[0.9rem] font-semibold px-6 py-3 shadow-[0_8px_22px_rgba(0,0,0,0.2)] transition-transform hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-xl" />
      <span>Need Help?</span>
    </a>
  );
}
