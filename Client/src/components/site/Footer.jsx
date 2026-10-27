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

const QUICK_LINKS = [
  { to: "/contactus", label: "Contact Us" },
  { to: "/track", label: "Track Order" },
  { to: "/shipping", label: "Shipping Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  const { categories, settings } = useSiteData();
  const siteName = settings.siteName || DEFAULT_SITE_NAME;
  const whatsapp = settings.whatsappNumber || "910000000000";

  return (
    <footer className="relative bg-primary text-secondary/75 overflow-hidden mt-20">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="max-w-container mx-auto px-5 md:px-8 py-14 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <Reveal>
            <span className="micro text-secondary/40">Do connect</span>
            <p className="font-serif text-secondary text-[1.8rem] md:text-[2.6rem] leading-[1.1] tracking-[-0.02em] mt-3 max-w-xl">
              {settings.tagline || "Thoughtfully designed pieces for everyday elegance."}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <Link
              to="/search"
              className="micro inline-flex items-center gap-2.5 px-7 py-4 rounded-[2px] bg-secondary text-primary hover:bg-white transition-colors duration-300"
            >
              Shop the collection <i className="fa-solid fa-arrow-right text-[0.6rem]" />
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="micro inline-flex items-center gap-2.5 px-7 py-4 rounded-[2px] border border-secondary/25 text-secondary hover:border-secondary hover:text-white transition-colors duration-300"
            >
              <i className="fa-brands fa-whatsapp" /> WhatsApp us
            </a>
          </Reveal>
        </div>
      </div>

      {/* Columns */}
      <Reveal className="max-w-container mx-auto px-5 md:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        <div>
          <Link to="/" className="inline-flex items-center">
            {settings.logo ? (
              <img
                src={imageUrl(settings.logo)}
                alt={siteName}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="font-serif font-medium text-xl text-white">{siteName}</span>
            )}
          </Link>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-secondary/55 max-w-xs">
            {settings.metaDescription || "Handpicked, tarnish-resistant jewelry designed for everyday elegance."}
          </p>
          <div className="flex gap-2 mt-6">
            {SOCIAL_ICONS.map(
              ({ key, icon }) =>
                settings.socialLinks?.[key] && (
                  <a
                    key={key}
                    href={settings.socialLinks[key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="w-10 h-10 rounded-[2px] border border-white/15 flex items-center justify-center transition-all duration-300 ease-premium hover:border-white hover:text-white hover:bg-white/10"
                  >
                    <i className={icon} />
                  </a>
                )
            )}
          </div>
        </div>

        <div>
          <h4 className="micro text-secondary/40 mb-5">Collections</h4>
          <ul className="space-y-3">
            {categories.slice(0, 6).map((c) => (
              <li key={c._id}>
                <Link to={`/category/${c.slug}`} className="text-[0.85rem] link-underline">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/search" className="text-[0.85rem] link-underline text-secondary/50">
                View all products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="micro text-secondary/40 mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-[0.85rem] link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="micro text-secondary/40 mb-5">Get in Touch</h4>
          <ul className="space-y-3.5 text-[0.85rem]">
            {settings.contactPhone && (
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-phone mt-1 text-[0.7rem] text-secondary/40" />
                <a href={`tel:${settings.contactPhone}`} className="link-underline">
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings.contactEmail && (
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-envelope mt-1 text-[0.7rem] text-secondary/40" />
                <a href={`mailto:${settings.contactEmail}`} className="link-underline break-all">
                  {settings.contactEmail}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-[0.7rem] text-secondary/40" />
                <span className="text-secondary/60">{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </Reveal>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-container mx-auto px-5 md:px-8 py-7 flex flex-col items-center gap-2.5 text-[0.72rem] text-secondary/40 text-center">
          <p>
            © {new Date().getFullYear()} {siteName} · All rights reserved
          </p>
          <p>
            Designed By{" "}
            <a
              href="https://codiqo.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-secondary transition-colors"
            >
              Codiqo.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
