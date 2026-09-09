import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const KNOWN_PAGES = [
  { slug: "about", title: "About Us" },
  { slug: "terms", title: "Terms & Conditions" },
  { slug: "shipping", title: "Shipping Policy" },
  { slug: "privacy", title: "Privacy Policy" },
];

export default function PagesAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [pages, setPages] = useState({});
  const [activeSlug, setActiveSlug] = useState("about");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get("/pages", token).then((list) => {
      const map = {};
      list.forEach((p) => (map[p.slug] = p));
      KNOWN_PAGES.forEach((kp) => {
        if (!map[kp.slug]) map[kp.slug] = { slug: kp.slug, title: kp.title, contentHtml: "" };
      });
      setPages(map);
    });
  }, [token]);

  const current = pages[activeSlug];

  function updateContent(html) {
    setPages((p) => ({ ...p, [activeSlug]: { ...p[activeSlug], contentHtml: html } }));
  }
  function updateTitle(title) {
    setPages((p) => ({ ...p, [activeSlug]: { ...p[activeSlug], title } }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await adminApi.put(`/pages/${activeSlug}`, { title: current.title, contentHtml: current.contentHtml }, token);
      showToast("Page saved");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (!current) return <div className="text-primary/60">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Pages</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {KNOWN_PAGES.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeSlug === p.slug ? "bg-primary text-white" : "bg-white border border-border text-primary/60"}`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 max-w-3xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Page Title</label>
          <input
            value={current.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Content <span className="text-primary/40 font-normal">(HTML — wrap paragraphs in &lt;p&gt;...&lt;/p&gt;)</span>
          </label>
          <textarea
            rows={12}
            value={current.contentHtml}
            onChange={(e) => updateContent(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm font-mono"
          />
        </div>
        <div className="border border-border rounded-lg p-4 bg-secondary">
          <p className="text-xs font-medium text-primary/50 mb-2">PREVIEW</p>
          <div className="prose prose-sm max-w-none [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: current.contentHtml }} />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Page"}
        </button>
      </div>
    </div>
  );
}
