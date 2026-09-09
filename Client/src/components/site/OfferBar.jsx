import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function OfferBar() {
  const { settings } = useSiteData();
  if (!settings.offerBarEnabled || !settings.offerBarText) return null;

  return (
    <div className="bg-primary text-white text-center text-xs md:text-sm py-2 px-4 tracking-wide">
      <span className="inline-flex items-center gap-2">
        <i className="fa-solid fa-tag text-[10px]" />
        {settings.offerBarText}
      </span>
    </div>
  );
}
