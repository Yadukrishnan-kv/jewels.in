import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function WhatsAppFloat() {
  const { settings } = useSiteData();
  const number = settings.whatsappNumber || "910000000000";

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-[#25D366] text-white text-2xl shadow-lg items-center justify-center hover:scale-105 transition-transform hidden md:flex"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp" />
    </a>
  );
}
