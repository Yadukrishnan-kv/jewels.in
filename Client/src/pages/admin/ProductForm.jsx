import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import ImageUploader from "../../components/admin/ImageUploader.jsx";

const EMPTY_VARIANT = () => ({ label: "Rs.", price: 0, discountPrice: 0, stock: 0, sku: "" });

const EMPTY_PRODUCT = {
  name: "",
  category: "",
  tags: [],
  images: [],
  specs: [],
  description: "",
  variants: [EMPTY_VARIANT()],
  badge: "",
  isViral: false,
  isActive: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [specsText, setSpecsText] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get("/categories", token).then(setCategories);
    adminApi.get("/tags", token).then(setTags);
  }, [token]);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.get(`/products/${id}`, token).then((p) => {
      setForm({
        ...p,
        category: p.category?._id || p.category,
        tags: (p.tags || []).map((t) => t._id || t),
      });
      setSpecsText((p.specs || []).join("\n"));
      setLoading(false);
    });
  }, [id, isEdit, token]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateVariant(idx, field, value) {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
    }));
  }
  function addVariant() {
    setForm((f) => ({ ...f, variants: [...f.variants, EMPTY_VARIANT()] }));
  }
  function removeVariant(idx) {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  }

  function addImage(url) {
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
  }
  function removeImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  function toggleTag(tagId) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tagId) ? f.tags.filter((t) => t !== tagId) : [...f.tags, tagId],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.category || form.variants.length === 0) {
      showToast("Name, category, and at least one variant are required", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      specs: specsText.split("\n").map((s) => s.trim()).filter(Boolean),
      variants: form.variants.map((v) => ({
        ...v,
        price: Number(v.price),
        discountPrice: Number(v.discountPrice) || 0,
        stock: Number(v.stock),
      })),
    };
    try {
      if (isEdit) {
        await adminApi.put(`/products/${id}`, payload, token);
        showToast("Product updated");
      } else {
        await adminApi.post("/products", payload, token);
        showToast("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-primary/60">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="icon-btn text-lg">
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <h1 className="text-2xl font-semibold">{isEdit ? "Edit Product" : "Add Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                required
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Badge</label>
              <select
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="">None</option>
                <option value="NEW">NEW</option>
                <option value="BESTSELLER">BESTSELLER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (homepage collections)</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  type="button"
                  key={t._id}
                  onClick={() => toggleTag(t._id)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    form.tags.includes(t._id) ? "bg-primary text-white border-primary" : "border-border text-primary/60"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
              Active (visible on site)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isViral} onChange={(e) => set("isViral", e.target.checked)} />
              Show in &quot;Virals You searching for&quot;
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Specs (one per line)</label>
            <textarea
              rows={3}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder="Premium alloy, tarnish-resistant plating"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Images</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {form.images.map((img, i) => (
              <div key={i} className="relative w-20 h-20">
                <img src={imageUrl(img)} alt="" className="w-full h-full object-cover rounded-lg border border-border" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-xs"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
          </div>
          <ImageUploader value="" onChange={addImage} label="Add image" />
        </div>

        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Variants</h3>
            <button type="button" onClick={addVariant} className="text-accent text-sm hover:underline">
              <i className="fa-solid fa-plus" /> Add variant
            </button>
          </div>
          <div className="space-y-3">
            {form.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 items-center border border-border rounded-lg p-3">
                <input
                  placeholder="Label"
                  value={v.label}
                  onChange={(e) => updateVariant(i, "label", e.target.value)}
                  className="col-span-2 border border-border rounded px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className="border border-border rounded px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Discount price"
                  value={v.discountPrice}
                  onChange={(e) => updateVariant(i, "discountPrice", e.target.value)}
                  className="border border-border rounded px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, "stock", e.target.value)}
                  className="border border-border rounded px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  disabled={form.variants.length === 1}
                  className="text-red-600 disabled:opacity-30 text-xs"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </button>
          <Link to="/admin/products" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
