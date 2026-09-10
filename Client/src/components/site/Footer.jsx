import { Link } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext.jsx";

const SOCIAL_ICONS = [
  { key: "instagram", icon: "fa-brands fa-instagram" },
  { key: "facebook", icon: "fa-brands fa-facebook-f" },
  { key: "youtube", icon: "fa-brands fa-youtube" },
];

export default function Footer() {
  const { categories, settings } = useSiteData();
  const featuredCategories = categories.slice(0, 5);

  return (
    <footer className="bg-accent text-[#e0e0e0] pt-[60px] pb-24 md:pb-[30px] mt-10">
      <div className="max-w-container mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="inline-flex items-center">
            <span className="font-serif font-semibold text-2xl text-white">{settings.siteName || "The Halla"}</span>
          </Link>
          <div className="flex gap-4 mt-5">
            {SOCIAL_ICONS.map(
              ({ key, icon }) =>
                settings.socialLinks?.[key] && (
                  <a
                    key={key}
                    href={settings.socialLinks[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-[#2f5a49] text-[#ddddcc] flex items-center justify-center transition-colors hover:border-white hover:text-white"
                  >
                    <i className={icon} />
                  </a>
                )
            )}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl text-white tracking-wide mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/contactus" className="text-[0.9rem] text-[#c6c6b5] transition-colors hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-[0.9rem] text-[#c6c6b5] transition-colors hover:text-white">
                Terms and condition
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="text-[0.9rem] text-[#c6c6b5] transition-colors hover:text-white">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-[0.9rem] text-[#c6c6b5] transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl text-white tracking-wide mb-6">Collections</h4>
          <ul className="space-y-3">
            {featuredCategories.map((c) => (
              <li key={c._id}>
                <Link to={`/category/${c.slug}`} className="text-[0.9rem] text-[#c6c6b5] transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center pt-10 mt-10 border-t border-[#2f5a49] text-[0.8rem] text-[#b9c7bd]">
        <p>© {new Date().getFullYear()} {settings.siteName || "Hala Jewels"}</p>
      </div>
    </footer>
  );
}
