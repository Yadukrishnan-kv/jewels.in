import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function WhatsAppFloat() {
  const { settings } = useSiteData();
  const number = settings.whatsappNumber || "910000000000";

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="fixed right-5 md:right-[30px] bottom-24 md:bottom-[30px] z-[90] inline-flex items-center gap-[10px] rounded-full bg-[#25D366] text-white text-[0.9rem] font-semibold pl-4 pr-5 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-all duration-300 ease-premium hover:scale-105 hover:shadow-[0_14px_34px_rgba(0,0,0,0.28)] animate-pulse-ring"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-xl" />
      <span className="hidden xs:inline">Need Help?</span>
    </a>
  );
}
