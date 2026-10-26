import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useConfirm } from "../../components/admin/ConfirmDialog.jsx";
import { formatPrice } from "../../utils/currency.js";
import { Field, Input, Textarea, Select, Toggle, CheckboxPill } from "../../components/admin/FormControls.jsx";

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

function ImageGrid({ images, onAdd, onRemove }) {
  const { token } = useAdminAuth();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const { url } = await adminApi.upload(file, token);
        onAdd(url);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {images.map((img, i) => (
        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group border border-border">
          <img src={imageUrl(img)} alt="" className="w-full h-full object-cover" />
          {i === 0 && (
            <span className="absolute bottom-1 left-1 text-[0.6rem] font-semibold bg-primary/80 text-white px-1.5 py-0.5 rounded-full">
              Cover
            </span>
          )}
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 w-5 h-5 bg-white/95 text-red-600 rounded-full text-[0.65rem] shadow-soft flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 ${
          dragOver ? "border-accent bg-accent/5 scale-[1.03]" : "border-border hover:border-accent/50 bg-secondary/40"
        }`}
      >
        {uploading ? (
          <i className="fa-solid fa-spinner fa-spin text-accent" />
        ) : (
          <>
            <i className="fa-solid fa-plus text-primary/35" />
            <span className="text-[0.6rem] text-primary/35 font-medium">Add</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const confirm = useConfirm();
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
  async function removeVariant(idx) {
    if (form.variants.length === 1) return;
    const ok = await confirm({ message: "Remove this variant?", confirmLabel: "Remove", danger: true });
    if (!ok) return;
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

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <div className="admin-skeleton h-8 w-48" />
        <div className="admin-skeleton h-64 w-full" />
      </div>
    );
  }

  const minPrice = Math.min(...form.variants.map((v) => Number(v.discountPrice) || Number(v.price) || 0));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="admin-icon-btn" aria-label="Back to products">
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-primary">{isEdit ? "Edit Product" : "Add Product"}</h1>
          <p className="text-sm text-primary/45">{isEdit ? form.name : "Create a new catalog item"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="admin-card p-6 space-y-4">
              <h3 className="font-semibold text-primary">Basic Information</h3>
              <Field label="Product name" required>
                <Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Aflah Anklet" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" required>
                  <Select required value={form.category} onChange={(e) => set("category", e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Badge">
                  <Select value={form.badge} onChange={(e) => set("badge", e.target.value)}>
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                  </Select>
                </Field>
              </div>
              <Field label="Description">
                <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short product description" />
              </Field>
              <Field label="Specs" hint="One per line — shown as a bullet list on the product page">
                <Textarea
                  rows={3}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  placeholder="Premium alloy&#10;Tarnish-resistant plating"
                />
              </Field>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="admin-card p-6">
              <h3 className="font-semibold text-primary mb-1">Images</h3>
              <p className="text-xs text-primary/45 mb-4">First image is used as the cover photo across the storefront.</p>
              <ImageGrid images={form.images} onAdd={addImage} onRemove={removeImage} />
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-card p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-primary">Variants &amp; Pricing</h3>
                  <p className="text-xs text-primary/45 mt-0.5">At least one variant is required (e.g. size, colour).</p>
                </div>
                <button type="button" onClick={addVariant} className="admin-btn-ghost admin-btn-sm">
                  <i className="fa-solid fa-plus text-xs" /> Add variant
                </button>
              </div>
              <div className="space-y-3">
                {form.variants.map((v, i) => (
                  <div key={i} className="relative border border-border rounded-xl p-4 bg-secondary/20">
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      disabled={form.variants.length === 1}
                      className="absolute top-3 right-3 admin-icon-btn !w-7 !h-7 hover:!text-red-600 hover:!bg-red-50 disabled:opacity-25 disabled:pointer-events-none"
                      aria-label="Remove variant"
                    >
                      <i className="fa-solid fa-trash-can text-xs" />
                    </button>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pr-8">
                      <Field label="Label">
                        <Input value={v.label} onChange={(e) => updateVariant(i, "label", e.target.value)} placeholder="e.g. Free Size" />
                      </Field>
                      <Field label="Price">
                        <Input type="number" min="0" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} />
                      </Field>
                      <Field label="Discount price">
                        <Input type="number" min="0" value={v.discountPrice} onChange={(e) => updateVariant(i, "discountPrice", e.target.value)} />
                      </Field>
                      <Field label="Stock">
                        <Input type="number" min="0" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="admin-card p-6 space-y-5">
              <h3 className="font-semibold text-primary">Preview</h3>
              <div className="rounded-xl overflow-hidden border border-border bg-secondary/30">
                <div className="aspect-square bg-secondary">
                  {form.images[0] ? (
                    <img src={imageUrl(form.images[0])} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/25">
                      <i className="fa-regular fa-image text-2xl" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-primary truncate">{form.name || "Product name"}</p>
                  <p className="text-sm font-semibold text-accent mt-1">{Number.isFinite(minPrice) ? formatPrice(minPrice) : "—"}</p>
                </div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-card p-6 space-y-5">
              <h3 className="font-semibold text-primary">Visibility</h3>
              <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label="Active" hint="Visible on the live storefront" />
              <Toggle
                checked={form.isViral}
                onChange={(v) => set("isViral", v)}
                label="Viral"
                hint='Shown in "Virals You searching for"'
              />
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="admin-card p-6">
              <h3 className="font-semibold text-primary mb-1">Tags</h3>
              <p className="text-xs text-primary/45 mb-3">Powers homepage collections &amp; search filters.</p>
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 && <p className="text-xs text-primary/35">No tags yet — add some from Homepage CMS.</p>}
                {tags.map((t) => (
                  <CheckboxPill key={t._id} checked={form.tags.includes(t._id)} onClick={() => toggleTag(t._id)}>
                    {t.name}
                  </CheckboxPill>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        <div className="sticky bottom-0 mt-6 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-secondary/80 backdrop-blur-xl border-t border-border flex gap-3">
          <button type="submit" disabled={saving} className="admin-btn-primary">
            {saving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </button>
          <Link to="/admin/products" className="admin-btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
