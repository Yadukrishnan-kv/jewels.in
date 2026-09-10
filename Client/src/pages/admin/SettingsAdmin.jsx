import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";
import { applyThemeColors } from "../../utils/theme.js";
import { setCurrencySymbol } from "../../utils/currency.js";

const THEME_COLOR_FIELDS = [
  { key: "primary", label: "Primary", hint: "Body text, dark buttons, admin sidebar", defaultHex: "#1a1a1a" },
  { key: "secondary", label: "Secondary", hint: "Page background", defaultHex: "#efede9" },
  { key: "accent", label: "Accent", hint: "Buttons, links, prices, highlights", defaultHex: "#142e25" },
  { key: "accentLight", label: "Accent (hover)", hint: "Hover state for accent buttons/links", defaultHex: "#1f4236" },
  { key: "border", label: "Border", hint: "Card borders and dividers", defaultHex: "#d9cfbd" },
];

const HOMEPAGE_TITLE_FIELDS = [
  { key: "collectionsTitle", label: "Collections grid heading", defaultValue: "Collections" },
  { key: "viralsTitle", label: "Viral products carousel heading", defaultValue: "Virals You searching for" },
  { key: "minimalGirliesTitle", label: "Promo section heading", defaultValue: "For Minimal Girlies" },
  { key: "testimonialsTitle", label: "Testimonials heading", defaultValue: "Our DMs Say It All" },
  { key: "storyTitle", label: "Photo gallery heading", defaultValue: "Slaying in the Style" },
];

const PAGE_TITLE_FIELDS = [
  { key: "searchPageTitle", label: "Shop page title" },
  { key: "searchPageSubtitle", label: "Shop page subtitle", multiline: true },
  { key: "contactPageTitle", label: "Contact page title" },
  { key: "contactPageSubtitle", label: "Contact page subtitle", multiline: true },
  { key: "trackPageTitle", label: "Track order page title" },
  { key: "trackPageSubtitle", label: "Track order page subtitle", multiline: true },
  { key: "cartPageTitle", label: "Cart page title" },
  { key: "wishlistPageTitle", label: "Wishlist page title" },
  { key: "relatedProductsTitle", label: 'Product page "related products" heading' },
];

export default function SettingsAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get("/settings", token).then(setForm);
  }, [token]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function setSocial(field, value) {
    setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [field]: value } }));
  }
  function setThemeColor(field, value) {
    setForm((f) => ({ ...f, themeColors: { ...f.themeColors, [field]: value } }));
  }
  function setSectionTitle(field, value) {
    setForm((f) => ({ ...f, sectionTitles: { ...f.sectionTitles, [field]: value } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.put("/settings", form, token);
      applyThemeColors(form.themeColors);
      setCurrencySymbol(form.currencySymbol);
      showToast("Settings saved");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div className="text-primary/60">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Site Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Branding</h3>
          <input placeholder="Site name" value={form.siteName} onChange={(e) => set("siteName", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <ImageUploader value={form.logo} onChange={(url) => set("logo", url)} label="Logo" />
          <ImageUploader value={form.favicon} onChange={(url) => set("favicon", url)} label="Favicon" />
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold">Theme Colors</h3>
            <p className="text-xs text-primary/50 mt-1">
              Rebrand the whole storefront and admin panel — no code changes or rebuild needed.
            </p>
          </div>
          {THEME_COLOR_FIELDS.map((f) => {
            const hex = form.themeColors?.[f.key] || f.defaultHex;
            return (
              <div key={f.key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setThemeColor(f.key, e.target.value)}
                  className="w-11 h-11 shrink-0 rounded-lg border border-border cursor-pointer p-0.5"
                  aria-label={f.label}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-28 shrink-0">{f.label}</span>
                    <input
                      type="text"
                      value={hex}
                      onChange={(e) => setThemeColor(f.key, e.target.value)}
                      className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm font-mono"
                    />
                  </div>
                  <p className="text-xs text-primary/50 mt-1">{f.hint}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Currency &amp; SEO</h3>
          <div>
            <label className="block text-xs text-primary/50 mb-1">Currency symbol (shown before every price)</label>
            <input
              placeholder="₹"
              value={form.currencySymbol || ""}
              onChange={(e) => set("currencySymbol", e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-primary/50 mb-1">Meta description (search engine result snippet)</label>
            <textarea
              placeholder="Short description of the store for search engines"
              rows={2}
              value={form.metaDescription || ""}
              onChange={(e) => set("metaDescription", e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold">Homepage Section Titles</h3>
            <p className="text-xs text-primary/50 mt-1">The headings shown above each homepage section.</p>
          </div>
          {HOMEPAGE_TITLE_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-primary/50 mb-1">{f.label}</label>
              <input
                placeholder={f.defaultValue}
                value={form.sectionTitles?.[f.key] ?? ""}
                onChange={(e) => setSectionTitle(f.key, e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold">Page Titles &amp; Headings</h3>
            <p className="text-xs text-primary/50 mt-1">Titles and subtitles shown on the shop, contact, track, cart, wishlist, and product pages.</p>
          </div>
          {PAGE_TITLE_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-primary/50 mb-1">{f.label}</label>
              {f.multiline ? (
                <textarea
                  rows={2}
                  value={form.sectionTitles?.[f.key] ?? ""}
                  onChange={(e) => setSectionTitle(f.key, e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm"
                />
              ) : (
                <input
                  value={form.sectionTitles?.[f.key] ?? ""}
                  onChange={(e) => setSectionTitle(f.key, e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm"
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Offer Bar</h3>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.offerBarEnabled} onChange={(e) => set("offerBarEnabled", e.target.checked)} />
            Show announcement bar
          </label>
          <input placeholder="Offer bar text" value={form.offerBarText} onChange={(e) => set("offerBarText", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Contact &amp; WhatsApp</h3>
          <div>
            <label className="block text-xs text-primary/50 mb-1">
              WhatsApp number (digits only, country code first — no + or spaces). Orders and contact form messages are sent here.
            </label>
            <input placeholder="919999999999" value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value.replace(/\D/g, ""))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          </div>
          <input placeholder="Contact phone (display)" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Contact email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <textarea placeholder="Address" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Google Maps embed URL (optional)" value={form.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Social Links</h3>
          <input placeholder="Instagram URL" value={form.socialLinks?.instagram || ""} onChange={(e) => setSocial("instagram", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Facebook URL" value={form.socialLinks?.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="YouTube URL" value={form.socialLinks?.youtube || ""} onChange={(e) => setSocial("youtube", e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
