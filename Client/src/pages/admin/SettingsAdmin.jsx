import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.put("/settings", form, token);
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
