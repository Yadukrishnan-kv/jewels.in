import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";

const PRICE_BUCKETS = [
  { key: "0-100", label: "₹0 - ₹100" },
  { key: "101-200", label: "₹101 - ₹200" },
  { key: "201-300", label: "₹201 - ₹300" },
  { key: "301-400", label: "₹301 - ₹400" },
  { key: "401-500", label: "₹401 - ₹500" },
  { key: "501-max", label: "₹501+" },
];

const DISCOUNTS = ["50", "30", "20", "10"];

const TAG_DEFS = [
  { label: "All", slug: "" },
  { label: "For Minimal Girlies", slug: "for-minimal-girlies" },
  { label: "Virals You searching for", slug: "virals-you-searching-for" },
  { label: "Silver Collections", slug: "silver-collections" },
  { label: "Under 199", slug: "under-199" },
  { label: "Elegance in every drop", slug: "elegance-in-every-drop" },
  { label: "Soft. Sensual. Stunning.", slug: "soft-sensual-stunning" },
  { label: "Luxe in Hala", slug: "luxe-in-hala" },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const search = params.get("search") || "";
  const tag = params.get("tag") || "";
  const priceRange = params.get("price_range") || "";
  const discount = params.get("discount") || "";
  const sort = params.get("sort") || "featured";

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (tag) qs.set("tag", tag);
    if (sort) qs.set("sort", sort);
    if (discount) qs.set("discount", discount);
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      qs.set("price_min", min);
      if (max !== "max") qs.set("price_max", max);
    }
    api
      .get(`/products?${qs.toString()}`)
      .then(setResult)
      .finally(() => setLoading(false));
  }, [search, tag, priceRange, discount, sort]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  const FiltersPanel = ({ idPrefix = "" }) => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm mb-3">Price Range</h4>
        <div className="space-y-2">
          {PRICE_BUCKETS.map((b) => (
            <label key={b.key} className="flex items-center justify-between text-sm cursor-pointer">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${idPrefix}price_range`}
                  checked={priceRange === b.key}
                  onChange={() => updateParam("price_range", b.key)}
                />
                {b.label}
              </span>
              <span className="text-primary/40 text-xs">({result?.priceCounts?.[b.key] ?? 0})</span>
            </label>
          ))}
          {priceRange && (
            <button onClick={() => updateParam("price_range", "")} className="text-xs text-accent underline">
              Clear price filter
            </button>
          )}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-3">Discount</h4>
        <div className="space-y-2">
          {DISCOUNTS.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name={`${idPrefix}discount`}
                checked={discount === d}
                onChange={() => updateParam("discount", d)}
              />
              {d}% or more off
            </label>
          ))}
          {discount && (
            <button onClick={() => updateParam("discount", "")} className="text-xs text-accent underline">
              Clear discount filter
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "All Products" }]} />
      <div className="max-w-container mx-auto px-4 md:px-8 pb-16">
        <div className="mb-6">
          <h1 className="font-serif text-2xl md:text-3xl">Our Collection</h1>
          <p className="text-sm text-primary/60 mt-1">{result ? `${result.total} products` : "Loading..."}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {TAG_DEFS.map((t) => (
            <button
              key={t.slug}
              onClick={() => updateParam("tag", t.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                tag === t.slug ? "bg-primary text-white border-primary" : "border-border text-primary/70 hover:border-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="md:hidden btn-outline w-full mb-4 justify-center"
        >
          <i className="fa-solid fa-sliders" /> Filters &amp; Sort
        </button>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
            </div>
            <FiltersPanel />
          </aside>

          <div className="flex-1">
            <div className="hidden md:flex justify-end mb-4">
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="border border-border rounded-full px-4 py-2 text-sm outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            {loading ? (
              <div className="text-center py-16 text-primary/60">Loading products...</div>
            ) : (
              <ProductGrid products={result?.products} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      <div
        className={`fixed inset-0 z-[170] md:hidden transition-opacity ${
          mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white p-6 overflow-y-auto transition-transform ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Filters &amp; Sort</h3>
            <button onClick={() => setMobileFiltersOpen(false)} className="icon-btn text-xl">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold text-sm mb-3">Sort By</h4>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full border border-border rounded-full px-4 py-2 text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <FiltersPanel idPrefix="m_" />
          <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary w-full justify-center mt-8">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
