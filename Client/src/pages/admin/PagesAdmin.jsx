import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import { Field, Input, Textarea } from "../../components/admin/FormControls.jsx";

const KNOWN_PAGES = [
  { slug: "about", title: "About Us", icon: "fa-circle-info" },
  { slug: "terms", title: "Terms & Conditions", icon: "fa-file-contract" },
  { slug: "shipping", title: "Shipping Policy", icon: "fa-truck-fast" },
  { slug: "privacy", title: "Privacy Policy", icon: "fa-shield-halved" },
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

  if (!current) {
    return (
      <div>
        <PageHeader title="Pages" subtitle="Edit static content pages shown on the storefront." />
        <div className="admin-skeleton h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Pages" subtitle="Edit static content pages shown on the storefront." />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1">
          {KNOWN_PAGES.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActiveSlug(p.slug)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeSlug === p.slug ? "bg-primary text-white" : "bg-white border border-border text-primary/60 hover:border-accent hover:text-accent"
              }`}
            >
              <i className={`fa-solid ${p.icon} w-4 text-center`} />
              {p.title}
            </button>
          ))}
        </div>

        <motion.div key={activeSlug} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
          <div className="admin-card p-6 space-y-4">
            <Field label="Page title">
              <Input value={current.title} onChange={(e) => updateTitle(e.target.value)} />
            </Field>
            <Field label="Content" hint="HTML — wrap paragraphs in <p>...</p>">
              <Textarea rows={14} value={current.contentHtml} onChange={(e) => updateContent(e.target.value)} className="font-mono text-xs" />
            </Field>
          </div>

          <div className="admin-card p-6">
            <p className="admin-label mb-3">Live preview</p>
            <div className="prose prose-sm max-w-none [&_p]:mb-3 border border-border rounded-xl p-5 bg-secondary/30 min-h-[120px]">
              {current.contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: current.contentHtml }} />
              ) : (
                <p className="text-primary/35 italic">Nothing to preview yet.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Saving...
                </>
              ) : (
                "Save Page"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
