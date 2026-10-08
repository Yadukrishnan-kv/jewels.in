import { Link } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { imageUrl } from "../../api/client.js";
import Reveal from "./Reveal.jsx";

const DEFAULT_SITE_NAME = "Store";

const SOCIAL_ICONS = [
  { key: "instagram", icon: "fa-brands fa-instagram" },
  { key: "facebook", icon: "fa-brands fa-facebook-f" },
  { key: "youtube", icon: "fa-brands fa-youtube" },
];

export default function Footer() {
  const { categories, settings } = useSiteData();
  const featuredCategories = categories.slice(0, 5);

  return (
    <footer className="relative bg-accent text-[#dcded9] pt-16 pb-28 md:pb-14 mt-16 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/[0.04] blur-3xl"
      />

      <Reveal className="max-w-container mx-auto px-6 md:px-8 relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        <div className="sm:col-span-2 md:col-span-1">
          <Link to="/" className="inline-flex items-center">
            {settings.logo ? (
              <img
                src={imageUrl(settings.logo)}
                alt={settings.siteName || DEFAULT_SITE_NAME}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="font-serif font-medium text-2xl text-white">{settings.siteName || DEFAULT_SITE_NAME}</span>
            )}
          </Link>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-[#c7cac3]/90 max-w-xs">
            {settings.tagline || "Thoughtfully designed pieces for everyday elegance."}
          </p>
          <div className="flex gap-3 mt-6">
            {SOCIAL_ICONS.map(
              ({ key, icon }) =>
                settings.socialLinks?.[key] && (
                  <a
                    key={key}
                    href={settings.socialLinks[key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="w-10 h-10 rounded-full border border-white/15 text-[#dcded9] flex items-center justify-center transition-all duration-300 ease-premium hover:border-white hover:text-white hover:bg-white/10 hover:-translate-y-0.5"
                  >
                    <i className={icon} />
                  </a>
                )
            )}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white tracking-wide mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: "/contactus", label: "Contact Us" },
              { to: "/terms", label: "Terms and condition" },
              { to: "/shipping", label: "Shipping Policy" },
              { to: "/privacy", label: "Privacy Policy" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[0.88rem] text-[#c7cac3] transition-all duration-200 hover:text-white hover:pl-1"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white tracking-wide mb-5">Collections</h4>
          <ul className="space-y-3">
            {featuredCategories.map((c) => (
              <li key={c._id}>
                <Link
                  to={`/category/${c.slug}`}
                  className="text-[0.88rem] text-[#c7cac3] transition-all duration-200 hover:text-white hover:pl-1"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white tracking-wide mb-5">Get in Touch</h4>
          <ul className="space-y-3 text-[0.88rem] text-[#c7cac3]">
            {settings.contactPhone && (
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-phone mt-1 text-[0.75rem] text-white/70" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition-colors">
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings.contactEmail && (
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-envelope mt-1 text-[0.75rem] text-white/70" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors break-all">
                  {settings.contactEmail}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-location-dot mt-1 text-[0.75rem] text-white/70" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </Reveal>

      <div className="max-w-container mx-auto px-6 md:px-8 text-center pt-10 mt-10 border-t border-white/10 text-[0.8rem] text-[#aab2a5] relative">
        <p>© {new Date().getFullYear()} {settings.siteName || DEFAULT_SITE_NAME} · All rights reserved</p>
      </div>
    </footer>
  );
}
