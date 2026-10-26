import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";
import { applyThemeColors } from "../../utils/theme.js";
import { setCurrencySymbol } from "../../utils/currency.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Tabs from "../../components/admin/Tabs.jsx";
import { Field, Input, Textarea, Toggle } from "../../components/admin/FormControls.jsx";

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

const TABS = [
  { value: "branding", label: "Branding", icon: "fa-palette" },
  { value: "theme", label: "Theme Colors", icon: "fa-swatchbook" },
  { value: "content", label: "Content", icon: "fa-heading" },
  { value: "contact", label: "Contact", icon: "fa-headset" },
  { value: "social", label: "Social", icon: "fa-share-nodes" },
];

export default function SettingsAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("branding");

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

  if (!form) {
    return (
      <div>
        <PageHeader title="Site Settings" subtitle="Branding, theme, content, and contact details." />
        <div className="admin-skeleton h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl pb-24">
      <PageHeader title="Site Settings" subtitle="Rebrand the whole storefront and admin panel — no code changes or rebuild needed." />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <form onSubmit={handleSubmit}>
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === "branding" && (
            <div className="admin-card p-6 space-y-4">
              <Field label="Site name">
                <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
              </Field>
              <Field label="Tagline">
                <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </Field>
              <div className="flex gap-6">
                <ImageUploader value={form.logo} onChange={(url) => set("logo", url)} label="Logo" />
                <ImageUploader value={form.favicon} onChange={(url) => set("favicon", url)} label="Favicon" />
              </div>
              <Field label="Currency symbol" hint="Shown before every price">
                <Input placeholder="₹" value={form.currencySymbol || ""} onChange={(e) => set("currencySymbol", e.target.value)} />
              </Field>
              <Field label="Meta description" hint="Search engine result snippet">
                <Textarea rows={2} value={form.metaDescription || ""} onChange={(e) => set("metaDescription", e.target.value)} />
              </Field>
              <div className="pt-2 border-t border-border">
                <Toggle checked={form.offerBarEnabled} onChange={(v) => set("offerBarEnabled", v)} label="Announcement bar" hint="Thin banner above the header" />
                {form.offerBarEnabled && (
                  <Input className="mt-3" placeholder="Offer bar text" value={form.offerBarText} onChange={(e) => set("offerBarText", e.target.value)} />
                )}
              </div>
            </div>
          )}

          {tab === "theme" && (
            <div className="admin-card p-6 space-y-5">
              {THEME_COLOR_FIELDS.map((f) => {
                const hex = form.themeColors?.[f.key] || f.defaultHex;
                return (
                  <div key={f.key} className="flex items-center gap-3">
                    <div className="relative w-11 h-11 shrink-0 rounded-xl border border-border overflow-hidden" style={{ backgroundColor: hex }}>
                      <input
                        type="color"
                        value={hex}
                        onChange={(e) => setThemeColor(f.key, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label={f.label}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-28 shrink-0 text-primary">{f.label}</span>
                        <Input value={hex} onChange={(e) => setThemeColor(f.key, e.target.value)} className="font-mono !py-1.5" />
                      </div>
                      <p className="text-xs text-primary/40 mt-1">{f.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "content" && (
            <div className="space-y-6">
              <div className="admin-card p-6 space-y-4">
                <h3 className="font-semibold text-primary">Homepage Section Titles</h3>
                {HOMEPAGE_TITLE_FIELDS.map((f) => (
                  <Field key={f.key} label={f.label}>
                    <Input placeholder={f.defaultValue} value={form.sectionTitles?.[f.key] ?? ""} onChange={(e) => setSectionTitle(f.key, e.target.value)} />
                  </Field>
                ))}
              </div>
              <div className="admin-card p-6 space-y-4">
                <h3 className="font-semibold text-primary">Page Titles &amp; Headings</h3>
                {PAGE_TITLE_FIELDS.map((f) => (
                  <Field key={f.key} label={f.label}>
                    {f.multiline ? (
                      <Textarea rows={2} value={form.sectionTitles?.[f.key] ?? ""} onChange={(e) => setSectionTitle(f.key, e.target.value)} />
                    ) : (
                      <Input value={form.sectionTitles?.[f.key] ?? ""} onChange={(e) => setSectionTitle(f.key, e.target.value)} />
                    )}
                  </Field>
                ))}
              </div>
            </div>
          )}

          {tab === "contact" && (
            <div className="admin-card p-6 space-y-4">
              <Field label="WhatsApp number" hint="Digits only, country code first — no + or spaces. Orders and contact messages are sent here.">
                <Input placeholder="919999999999" value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value.replace(/\D/g, ""))} />
              </Field>
              <Field label="Contact phone (display)">
                <Input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
              </Field>
              <Field label="Contact email">
                <Input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
              </Field>
              <Field label="Address">
                <Textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} />
              </Field>
              <Field label="Google Maps embed URL" hint="Optional">
                <Input value={form.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} />
              </Field>
            </div>
          )}

          {tab === "social" && (
            <div className="admin-card p-6 space-y-4">
              <Field label="Instagram URL">
                <Input value={form.socialLinks?.instagram || ""} onChange={(e) => setSocial("instagram", e.target.value)} />
              </Field>
              <Field label="Facebook URL">
                <Input value={form.socialLinks?.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} />
              </Field>
              <Field label="YouTube URL">
                <Input value={form.socialLinks?.youtube || ""} onChange={(e) => setSocial("youtube", e.target.value)} />
              </Field>
            </div>
          )}
        </motion.div>

        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/90 backdrop-blur-xl border-t border-border px-4 md:px-8 py-4 flex justify-end z-40">
          <button type="submit" disabled={saving} className="admin-btn-primary">
            {saving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
