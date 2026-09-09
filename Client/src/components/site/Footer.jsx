import { Link } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function Footer() {
  const { categories, settings } = useSiteData();
  const featuredCategories = categories.slice(0, 5);

  return (
    <footer className="bg-primary text-white/90 mt-20 pb-24 md:pb-0">
      <div className="max-w-container mx-auto px-6 md:px-12 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif text-2xl mb-2">{settings.siteName || "The Halla"}</h3>
          <p className="text-sm text-white/60 mb-4">{settings.tagline}</p>
          <div className="flex gap-4 text-lg">
            {settings.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                <i className="fa-brands fa-instagram" />
              </a>
            )}
            {settings.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-white">
                <i className="fa-brands fa-facebook" />
              </a>
            )}
            {settings.socialLinks?.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-white">
                <i className="fa-brands fa-youtube" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/contactus" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms and Condition</Link></li>
            <li><Link to="/shipping" className="hover:text-white">Shipping Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase">Collections</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {featuredCategories.map((c) => (
              <li key={c._id}>
                <Link to={`/category/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase">Get in touch</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {settings.contactPhone && <li><i className="fa-solid fa-phone mr-2" />{settings.contactPhone}</li>}
            {settings.contactEmail && <li><i className="fa-solid fa-envelope mr-2" />{settings.contactEmail}</li>}
            {settings.address && <li className="max-w-xs"><i className="fa-solid fa-location-dot mr-2" />{settings.address}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear() || 2026} {settings.siteName || "Hala Jewels"} · Cloned build for demonstration purposes
      </div>
    </footer>
  );
}
