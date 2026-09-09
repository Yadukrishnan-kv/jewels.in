import { useEffect, useState } from "react";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Modal from "../../components/admin/Modal.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const EMPTY = { name: "", image: "", sortOrder: 0, isActive: true, showOnHome: true };

export default function CategoriesAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    adminApi.get("/categories", token).then(setCategories);
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

  async function handleDelete(id) {
    if (!confirm("Delete this category? Products in it will remain but lose their category link.")) return;
    await adminApi.del(`/categories/${id}`, token);
    showToast("Category deleted");
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button onClick={openNew} className="btn-primary">
          <i className="fa-solid fa-plus" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="aspect-square bg-secondary">
              <img src={imageUrl(c.image)} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="font-medium text-sm truncate">{c.name}</p>
              <p className="text-xs text-primary/50">{c.isActive ? "Active" : "Hidden"} · sort {c.sortOrder}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => openEdit(c)} className="text-accent text-xs hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(c._id)} className="text-red-600 text-xs hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <ImageUploader value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          <input
            type="number"
            placeholder="Sort order"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.showOnHome} onChange={(e) => setForm((f) => ({ ...f, showOnHome: e.target.checked }))} />
            Show in homepage collections grid
          </label>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
