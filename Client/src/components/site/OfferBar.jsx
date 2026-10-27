import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function OfferBar() {
  const { settings } = useSiteData();
  if (!settings.offerBarEnabled || !settings.offerBarText) return null;

  return (
    <div className="bg-primary text-secondary/90 text-center py-2.5 px-4 overflow-hidden">
      <span className="micro inline-flex items-center gap-3 tracking-micro">
        <span className="w-1 h-1 bg-accent-light rotate-45" aria-hidden />
        {settings.offerBarText}
        <span className="w-1 h-1 bg-accent-light rotate-45" aria-hidden />
      </span>
    </div>
  );
}
