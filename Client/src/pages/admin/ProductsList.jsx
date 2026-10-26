import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useConfirm } from "../../components/admin/ConfirmDialog.jsx";
import { formatPrice } from "../../utils/currency.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Badge from "../../components/admin/Badge.jsx";
import { Select } from "../../components/admin/FormControls.jsx";

function stockBadge(stock) {
  if (stock === 0) return <Badge tone="danger">Out of stock</Badge>;
  if (stock <= 5) return <Badge tone="warning">{stock} left</Badge>;
  return <Badge tone="neutral">{stock} in stock</Badge>;
}

export default function ProductsList() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminApi
      .get(`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`, token)
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    adminApi.get("/categories", token).then(setCategories);
  }, [token]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(p) {
    const ok = await confirm({
      title: "Delete product?",
      message: `"${p.name}" will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    await adminApi.del(`/products/${p._id}`, token);
    showToast("Product deleted");
    load();
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter && p.category?._id !== categoryFilter) return false;
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "hidden" && p.isActive) return false;
      return true;
    });
  }, [products, categoryFilter, statusFilter]);

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3 min-w-0">
          <img src={imageUrl(p.images?.[0])} alt="" className="w-11 h-11 rounded-lg object-cover bg-secondary shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-primary truncate max-w-[220px]">{p.name}</p>
            {p.badge && <span className="text-[0.65rem] font-semibold text-accent uppercase tracking-wide">{p.badge}</span>}
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (p) => <span className="text-primary/60">{p.category?.name || "—"}</span> },
    {
      key: "price",
      header: "Price",
      render: (p) => formatPrice(p.variants?.[0]?.discountPrice || p.variants?.[0]?.price || 0),
    },
    { key: "stock", header: "Stock", render: (p) => stockBadge((p.variants || []).reduce((s, v) => s + v.stock, 0)) },
    { key: "status", header: "Status", render: (p) => <Badge tone={p.isActive ? "success" : "neutral"}>{p.isActive ? "Active" : "Hidden"}</Badge> },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/admin/products/${p._id}`} className="admin-icon-btn" aria-label="Edit">
            <i className="fa-solid fa-pen text-xs" />
          </Link>
          <button onClick={() => handleDelete(p)} className="admin-icon-btn hover:!text-red-600 hover:!bg-red-50" aria-label="Delete">
            <i className="fa-solid fa-trash-can text-xs" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} product${products.length === 1 ? "" : "s"} in your catalog`}
        actions={
          <Link to="/admin/products/new" className="admin-btn-primary">
            <i className="fa-solid fa-plus" /> Add Product
          </Link>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="admin-input pl-10"
          />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="!w-auto min-w-[160px]">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="!w-auto min-w-[140px]">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        pageSize={10}
        empty={{
          icon: "fa-gem",
          title: "No products found",
          message: search || categoryFilter || statusFilter ? "Try adjusting your filters." : "Add your first product to get started.",
        }}
      />
    </div>
  );
}
