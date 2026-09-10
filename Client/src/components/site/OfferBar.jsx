import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function OfferBar() {
  const { settings } = useSiteData();
  if (!settings.offerBarEnabled || !settings.offerBarText) return null;

  return (
    <div className="bg-accent text-white text-center text-[0.75rem] font-medium py-2 px-4 overflow-hidden whitespace-nowrap">
      <span className="inline-flex items-center gap-[6px]">
        <i className="fa-regular fa-message text-[0.7rem]" />
        {settings.offerBarText}
      </span>
    </div>
  );
}
