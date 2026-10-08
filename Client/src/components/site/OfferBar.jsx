import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function OfferBar() {
  const { settings } = useSiteData();
  if (!settings.offerBarEnabled || !settings.offerBarText) return null;

  return (
    <div className="relative bg-primary text-white text-center text-[0.72rem] font-medium py-2.5 px-4 overflow-hidden tracking-wide">
      <span className="relative inline-flex items-center gap-[7px]">
        <i className="fa-solid fa-sparkles text-[0.68rem] text-accent-light" />
        {settings.offerBarText}
      </span>
    </div>
  );
}
