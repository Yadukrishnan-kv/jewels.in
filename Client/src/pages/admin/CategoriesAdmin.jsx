import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useConfirm } from "../../components/admin/ConfirmDialog.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Badge from "../../components/admin/Badge.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";
import { CardGridSkeleton } from "../../components/admin/Skeletons.jsx";
import { Field, Input, Toggle } from "../../components/admin/FormControls.jsx";

const EMPTY = { name: "", image: "", sortOrder: 0, isActive: true, showOnHome: true };

export default function CategoriesAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .get("/categories", token)
      .then(setCategories)
      .finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  function openNew() {
    setForm(EMPTY);
    setEditingId(null);
    setModalOpen(true);
  }
  function openEdit(c) {
    setForm({ name: c.name, image: c.image, sortOrder: c.sortOrder, isActive: c.isActive, showOnHome: c.showOnHome });
    setEditingId(c._id);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.put(`/categories/${editingId}`, form, token);
        showToast("Category updated");
      } else {
        await adminApi.post("/categories", form, token);
        showToast("Category created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c) {
    const ok = await confirm({
      title: "Delete category?",
      message: `"${c.name}" will be removed. Products in it will remain but lose their category link.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    await adminApi.del(`/categories/${c._id}`, token);
    showToast("Category deleted");
    load();
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categor${categories.length === 1 ? "y" : "ies"} in your store`}
        actions={
          <button onClick={openNew} className="admin-btn-primary">
            <i className="fa-solid fa-plus" /> Add Category
          </button>
        }
      />

      {loading ? (
        <CardGridSkeleton />
      ) : categories.length === 0 ? (
        <div className="admin-card">
          <EmptyState icon="fa-layer-group" title="No categories yet" message="Create your first category to start organizing products." />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="admin-card-hover overflow-hidden group"
            >
              <div className="aspect-square bg-secondary relative">
                <img src={imageUrl(c.image)} alt={c.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(c)}
                    className="w-9 h-9 rounded-full bg-white/95 text-primary flex items-center justify-center hover:bg-white"
                    aria-label="Edit"
                  >
                    <i className="fa-solid fa-pen text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="w-9 h-9 rounded-full bg-white/95 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white"
                    aria-label="Delete"
                  >
                    <i className="fa-solid fa-trash-can text-xs" />
                  </button>
                </div>
              </div>
              <div className="p-3.5">
                <p className="font-medium text-sm truncate text-primary">{c.name}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "Active" : "Hidden"}</Badge>
                  <span className="text-xs text-primary/35">sort {c.sortOrder}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Category name" required>
            <Input required placeholder="e.g. Anklets" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} label="Category image" />
          <Field label="Sort order" hint="Lower numbers appear first">
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
            />
          </Field>
          <Toggle checked={form.isActive} onChange={(v) => setForm((f) => ({ ...f, isActive: v }))} label="Active" hint="Visible on the storefront" />
          <Toggle
            checked={form.showOnHome}
            onChange={(v) => setForm((f) => ({ ...f, showOnHome: v }))}
            label="Show on homepage"
            hint="Included in the homepage collections grid"
          />
          <button type="submit" disabled={saving} className="admin-btn-primary w-full">
            {saving ? "Saving..." : "Save Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
