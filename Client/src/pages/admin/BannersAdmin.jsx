import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useConfirm } from "../../components/admin/ConfirmDialog.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Tabs from "../../components/admin/Tabs.jsx";
import Badge from "../../components/admin/Badge.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";
import { CardGridSkeleton } from "../../components/admin/Skeletons.jsx";
import { Field, Input, Select, Toggle } from "../../components/admin/FormControls.jsx";

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
const EMPTY_TAG = { name: "" };

function useCrud(resource, token, emptyForm) {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .get(`/${resource}`, token)
      .then(setItems)
      .finally(() => setLoading(false));
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
  async function handleDelete(id, label = "this item") {
    const ok = await confirm({ title: "Delete item?", message: `${label} will be permanently removed.`, confirmLabel: "Delete", danger: true });
    if (!ok) return;
    await adminApi.del(`/${resource}/${id}`, token);
    showToast("Deleted");
    load();
  }

  return { items, loading, modalOpen, setModalOpen, form, setForm, editingId, saving, openNew, openEdit, handleSubmit, handleDelete };
}

function BannersTab() {
  const { token } = useAdminAuth();
  const c = useCrud("banners", token, EMPTY_BANNER);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={c.openNew} className="admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Banner
        </button>
      </div>
      {c.loading ? (
        <CardGridSkeleton />
      ) : c.items.length === 0 ? (
        <div className="admin-card">
          <EmptyState icon="fa-image" title="No banners yet" message="Add a banner to populate this homepage section." />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {c.items.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="admin-card-hover overflow-hidden">
              <div className="aspect-video bg-secondary">
                <img src={imageUrl(b.image)} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3.5">
                <Badge tone="accent" className="mb-1.5">
                  {b.section}
                </Badge>
                <p className="font-medium text-sm truncate text-primary">{b.title || "(no title)"}</p>
                <div className="flex gap-3 mt-2.5">
                  <button onClick={() => c.openEdit(b)} className="text-accent text-xs font-medium hover:underline">
                    Edit
                  </button>
                  <button onClick={() => c.handleDelete(b._id, "This banner")} className="text-red-600 text-xs font-medium hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Banner" : "Add Banner"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <Field label="Section">
            <Select value={c.form.section} onChange={(e) => c.setForm((f) => ({ ...f, section: e.target.value }))}>
              {SECTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
          <ImageUploader value={c.form.image} onChange={(url) => c.setForm((f) => ({ ...f, image: url }))} label="Banner image" aspect="aspect-video" />
          <Field label="Title">
            <Input value={c.form.title} onChange={(e) => c.setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Subtitle">
            <Input value={c.form.subtitle} onChange={(e) => c.setForm((f) => ({ ...f, subtitle: e.target.value }))} />
          </Field>
          <Field label="Link URL" hint="e.g. /search?tag=luxe-in-hala">
            <Input value={c.form.linkUrl} onChange={(e) => c.setForm((f) => ({ ...f, linkUrl: e.target.value }))} />
          </Field>
          <Field label="Button label">
            <Input value={c.form.ctaLabel} onChange={(e) => c.setForm((f) => ({ ...f, ctaLabel: e.target.value }))} />
          </Field>
          <Field label="Sort order">
            <Input type="number" value={c.form.sortOrder} onChange={(e) => c.setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
          </Field>
          <Toggle checked={c.form.isActive} onChange={(v) => c.setForm((f) => ({ ...f, isActive: v }))} label="Active" />
          <button type="submit" disabled={c.saving} className="admin-btn-primary w-full">
            {c.saving ? "Saving..." : "Save Banner"}
          </button>
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
        <button onClick={c.openNew} className="admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Testimonial
        </button>
      </div>
      {c.loading ? (
        <CardGridSkeleton />
      ) : c.items.length === 0 ? (
        <div className="admin-card">
          <EmptyState icon="fa-comment-dots" title="No testimonials yet" message="Add a customer screenshot to show on the homepage." />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {c.items.map((t, i) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="admin-card-hover overflow-hidden">
              <div className="aspect-square bg-secondary">
                <img src={imageUrl(t.image)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex gap-3">
                <button onClick={() => c.openEdit(t)} className="text-accent text-xs font-medium hover:underline">
                  Edit
                </button>
                <button onClick={() => c.handleDelete(t._id, "This testimonial")} className="text-red-600 text-xs font-medium hover:underline">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <ImageUploader value={c.form.image} onChange={(url) => c.setForm((f) => ({ ...f, image: url }))} label="Screenshot / photo" />
          <Field label="Caption (optional)">
            <Input value={c.form.caption} onChange={(e) => c.setForm((f) => ({ ...f, caption: e.target.value }))} />
          </Field>
          <Field label="Sort order">
            <Input type="number" value={c.form.sortOrder} onChange={(e) => c.setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
          </Field>
          <Toggle checked={c.form.isActive} onChange={(v) => c.setForm((f) => ({ ...f, isActive: v }))} label="Active" />
          <button type="submit" disabled={c.saving} className="admin-btn-primary w-full">
            {c.saving ? "Saving..." : "Save Testimonial"}
          </button>
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
        <button onClick={c.openNew} className="admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Reel
        </button>
      </div>
      <div className="admin-card overflow-hidden">
        {c.loading ? (
          <div className="p-6 admin-skeleton h-24" />
        ) : c.items.length === 0 ? (
          <EmptyState icon="fa-clapperboard" title="No reels yet" message="Embed an Instagram reel to show on the homepage." />
        ) : (
          <div className="divide-y divide-border">
            {c.items.map((r) => (
              <div key={r._id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <p className="text-sm text-primary/70 truncate">{r.embedUrl}</p>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-primary/35">sort {r.sortOrder}</span>
                  <button onClick={() => c.openEdit(r)} className="text-accent text-xs font-medium hover:underline">
                    Edit
                  </button>
                  <button onClick={() => c.handleDelete(r._id, "This reel")} className="text-red-600 text-xs font-medium hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Reel" : "Add Reel"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <Field label="Embed URL">
            <Input
              value={c.form.embedUrl}
              onChange={(e) => c.setForm((f) => ({ ...f, embedUrl: e.target.value }))}
              placeholder="https://www.instagram.com/reel/XXXX/embed"
            />
          </Field>
          <Field label="Sort order">
            <Input type="number" value={c.form.sortOrder} onChange={(e) => c.setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
          </Field>
          <Toggle checked={c.form.isActive} onChange={(v) => c.setForm((f) => ({ ...f, isActive: v }))} label="Active" />
          <button type="submit" disabled={c.saving} className="admin-btn-primary w-full">
            {c.saving ? "Saving..." : "Save Reel"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function TagsTab() {
  const { token } = useAdminAuth();
  const c = useCrud("tags", token, EMPTY_TAG);
  return (
    <div>
      <p className="text-sm text-primary/55 mb-4 max-w-2xl">
        Tags power the homepage promo tiles and the tag filter chips on the search page (e.g. &quot;Luxe in Hala&quot;, &quot;Under 199&quot;). Assign them
        to products from the product edit form.
      </p>
      <div className="flex justify-end mb-4">
        <button onClick={c.openNew} className="admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Tag
        </button>
      </div>
      {c.loading ? (
        <div className="admin-skeleton h-10 w-64" />
      ) : c.items.length === 0 ? (
        <div className="admin-card">
          <EmptyState icon="fa-tags" title="No tags yet" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {c.items.map((t) => (
            <div key={t._id} className="flex items-center gap-2 bg-white border border-border rounded-full pl-4 pr-2 py-1.5">
              <span className="text-sm text-primary">{t.name}</span>
              <button onClick={() => c.openEdit(t)} className="admin-icon-btn !w-6 !h-6" aria-label="Edit">
                <i className="fa-solid fa-pen text-[0.65rem]" />
              </button>
              <button onClick={() => c.handleDelete(t._id, "This tag")} className="admin-icon-btn !w-6 !h-6 hover:!text-red-600" aria-label="Delete">
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}
      <Modal open={c.modalOpen} onClose={() => c.setModalOpen(false)} title={c.editingId ? "Edit Tag" : "Add Tag"}>
        <form onSubmit={c.handleSubmit} className="space-y-4">
          <Field label="Tag name" required>
            <Input required value={c.form.name} onChange={(e) => c.setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <button type="submit" disabled={c.saving} className="admin-btn-primary w-full">
            {c.saving ? "Saving..." : "Save Tag"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

const TABS = [
  { value: "banners", label: "Banners", icon: "fa-image" },
  { value: "testimonials", label: "Testimonials", icon: "fa-comment-dots" },
  { value: "reels", label: "Reels", icon: "fa-clapperboard" },
  { value: "tags", label: "Tags", icon: "fa-tags" },
];

export default function BannersAdmin() {
  const [tab, setTab] = useState("banners");
  return (
    <div>
      <PageHeader title="Homepage CMS" subtitle="Edit the content blocks shown on your live homepage." />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "banners" && <BannersTab />}
      {tab === "testimonials" && <TestimonialsTab />}
      {tab === "reels" && <ReelsTab />}
      {tab === "tags" && <TagsTab />}
    </div>
  );
}
