import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, imageUrl } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

function formatPrice(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function ProductsList() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminApi
      .get(`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`, token)
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await adminApi.del(`/products/${id}`, token);
    showToast("Product deleted");
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <i className="fa-solid fa-plus" /> Add Product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full max-w-sm border border-border rounded-lg px-4 py-2 text-sm mb-4 outline-none focus:border-accent"
      />

      <div className="bg-white border border-border rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-primary/50">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-primary/50">No products found.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t border-border">
                  <td className="px-4 py-2">
                    <img src={imageUrl(p.images?.[0])} alt="" className="w-10 h-10 rounded object-cover bg-secondary" />
                  </td>
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2 text-primary/60">{p.category?.name}</td>
                  <td className="px-4 py-2">{formatPrice(p.variants?.[0]?.discountPrice || p.variants?.[0]?.price || 0)}</td>
                  <td className="px-4 py-2">{(p.variants || []).reduce((s, v) => s + v.stock, 0)}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <Link to={`/admin/products/${p._id}`} className="text-accent hover:underline text-xs mr-3">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
