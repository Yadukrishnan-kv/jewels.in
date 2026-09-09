import { useEffect, useState } from "react";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const SECTIONS = [
  { value: "hero", label: "Hero (top of homepage)" },
  { value: "promo-large", label: "Promo — Luxe in Hala (large)" },
  { value: "promo-small", label: "Promo — small tiles (Silver / Under 199)" },
  { value: "mid-promo", label: "Mid promo (Elegance / Soft Sensual Stunning)" },
  { value: "story", label: "Story grid (Slaying in the Style)" },
];

const EMPTY_BANNER = { section: "hero", title: "", subtitle: "", image: "", linkUrl: "", ctaLabel: "Shop now", sortOrder: 0, isActive: true };
const EMPTY_TESTIMONIAL = { image: "", caption: "", sortOrder: 0, isActive: true };
const EMPTY_REEL = { embedUrl: "", thumbnail: "", sortOrder: 0, isActive: true };

function useCrud(resource, token, emptyForm) {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    adminApi.get(`/${resource}`, token).then(setItems);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [token, resource]);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }
  function openEdit(item) {
    setForm({ ...emptyForm, ...item });
    setEditingId(item._id);
    setModalOpen(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) await adminApi.put(`/${resource}/${editingId}`, form, token);
      else await adminApi.post(`/${resource}`, form, token);
      showToast("Saved");
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    await adminApi.del(`/${resource}/${id}`, token);
    showToast("Deleted");
    load();
  }

  return { items, modalOpen, setModalOpen, form, setForm, editingId, saving, openNew, openEdit, handleSubmit, handleDelete };
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium ${active ? "bg-primary text-white" : "bg-white border border-border text-primary/60"}`}
    >
      {children}
    </button>
  );
}

function BannersTab() {
  const { token } = useAdminAuth();
  const c = useCrud("banners", token, EMPTY_BANNER);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={c.openNew} className="btn-primary">
          <i className="fa-solid fa-plus" /> Add Banner
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {c.items.map((b) => (
          <div key={b._id} className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="aspect-video bg-secondary">
              <img src={imageUrl(b.image)} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-xs text-accent uppercase font-semibold">{b.section}</p>
              <p className="font-medium text-sm truncate">{b.title || "(no title)"}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => c.openEdit(b)} className="text-accent text-xs hover:underline">Edit</button>
                <button onClick={() => c.handleDelete(b._id)} className="text-red-600 text-xs hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Banner" : "Add Banner"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <select
            value={c.form.section}
            onChange={(e) => c.setForm((f) => ({ ...f, section: e.target.value }))}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm"
          >
            {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ImageUploader value={c.form.image} onChange={(url) => c.setForm((f) => ({ ...f, image: url }))} />
          <input placeholder="Title" value={c.form.title} onChange={(e) => c.setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Subtitle" value={c.form.subtitle} onChange={(e) => c.setForm((f) => ({ ...f, subtitle: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Link URL e.g. /search?tag=luxe-in-hala" value={c.form.linkUrl} onChange={(e) => c.setForm((f) => ({ ...f, linkUrl: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Button label" value={c.form.ctaLabel} onChange={(e) => c.setForm((f) => ({ ...f, ctaLabel: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Sort order" value={c.form.sortOrder} onChange={(e) => c.setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={c.form.isActive} onChange={(e) => c.setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
          </label>
          <button type="submit" disabled={c.saving} className="btn-primary w-full justify-center">{c.saving ? "Saving..." : "Save"}</button>
        </form>
      </Modal>
    </div>
  );
}

function TestimonialsTab() {
  const { token } = useAdminAuth();
  const c = useCrud("testimonials", token, EMPTY_TESTIMONIAL);
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={c.openNew} className="btn-primary"><i className="fa-solid fa-plus" /> Add Testimonial</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {c.items.map((t) => (
          <div key={t._id} className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="aspect-square bg-secondary"><img src={imageUrl(t.image)} alt="" className="w-full h-full object-cover" /></div>
            <div className="p-3 flex gap-3">
              <button onClick={() => c.openEdit(t)} className="text-accent text-xs hover:underline">Edit</button>
              <button onClick={() => c.handleDelete(t._id)} className="text-red-600 text-xs hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <ImageUploader value={c.form.image} onChange={(url) => c.setForm((f) => ({ ...f, image: url }))} label="Screenshot / photo" />
          <input placeholder="Caption (optional)" value={c.form.caption} onChange={(e) => c.setForm((f) => ({ ...f, caption: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Sort order" value={c.form.sortOrder} onChange={(e) => c.setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={c.form.isActive} onChange={(e) => c.setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
          </label>
          <button type="submit" disabled={c.saving} className="btn-primary w-full justify-center">{c.saving ? "Saving..." : "Save"}</button>
        </form>
      </Modal>
    </div>
  );
}

function ReelsTab() {
  const { token } = useAdminAuth();
  const c = useCrud("reels", token, EMPTY_REEL);
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={c.openNew} className="btn-primary"><i className="fa-solid fa-plus" /> Add Reel</button>
      </div>
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr><th className="px-4 py-3">Embed URL</th><th className="px-4 py-3">Sort</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {c.items.map((r) => (
              <tr key={r._id} className="border-t border-border">
                <td className="px-4 py-2 truncate max-w-xs">{r.embedUrl}</td>
                <td className="px-4 py-2">{r.sortOrder}</td>
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <button onClick={() => c.openEdit(r)} className="text-accent text-xs hover:underline mr-3">Edit</button>
                  <button onClick={() => c.handleDelete(r._id)} className="text-red-600 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Reel" : "Add Reel"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <input placeholder="https://www.instagram.com/reel/XXXX/embed" value={c.form.embedUrl} onChange={(e) => c.setForm((f) => ({ ...f, embedUrl: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Sort order" value={c.form.sortOrder} onChange={(e) => c.setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={c.form.isActive} onChange={(e) => c.setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
          </label>
          <button type="submit" disabled={c.saving} className="btn-primary w-full justify-center">{c.saving ? "Saving..." : "Save"}</button>
        </form>
      </Modal>
    </div>
  );
}

const EMPTY_TAG = { name: "" };

function TagsTab() {
  const { token } = useAdminAuth();
  const c = useCrud("tags", token, EMPTY_TAG);
  return (
    <div>
      <p className="text-sm text-primary/60 mb-4">
        Tags power the homepage promo tiles and the tag filter chips on the search page (e.g. &quot;Luxe in Hala&quot;, &quot;Under 199&quot;).
        Assign them to products from the product edit form.
      </p>
      <div className="flex justify-end mb-4">
        <button onClick={c.openNew} className="btn-primary"><i className="fa-solid fa-plus" /> Add Tag</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {c.items.map((t) => (
          <div key={t._id} className="flex items-center gap-2 bg-white border border-border rounded-full pl-4 pr-2 py-1.5">
            <span className="text-sm">{t.name}</span>
            <button onClick={() => c.openEdit(t)} className="text-accent text-xs hover:underline">Edit</button>
            <button onClick={() => c.handleDelete(t._id)} className="text-red-600 text-xs hover:underline">×</button>
          </div>
        ))}
      </div>
      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Tag" : "Add Tag"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <input required placeholder="Tag name" value={c.form.name} onChange={(e) => c.setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <button type="submit" disabled={c.saving} className="btn-primary w-full justify-center">{c.saving ? "Saving..." : "Save"}</button>
        </form>
      </Modal>
    </div>
  );
}

export default function BannersAdmin() {
  const [tab, setTab] = useState("banners");
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Homepage CMS</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <TabButton active={tab === "banners"} onClick={() => setTab("banners")}>Banners</TabButton>
        <TabButton active={tab === "testimonials"} onClick={() => setTab("testimonials")}>Testimonials</TabButton>
        <TabButton active={tab === "reels"} onClick={() => setTab("reels")}>Reels</TabButton>
        <TabButton active={tab === "tags"} onClick={() => setTab("tags")}>Tags</TabButton>
      </div>
      {tab === "banners" && <BannersTab />}
      {tab === "testimonials" && <TestimonialsTab />}
      {tab === "reels" && <ReelsTab />}
      {tab === "tags" && <TagsTab />}
    </div>
  );
}
