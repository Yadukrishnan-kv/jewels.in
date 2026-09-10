import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";

const PRICE_BUCKETS = [
  { key: "0-100", label: "₹ 0 – ₹ 100" },
  { key: "101-200", label: "₹ 101 – ₹ 200" },
  { key: "201-300", label: "₹ 201 – ₹ 300" },
  { key: "301-400", label: "₹ 301 – ₹ 400" },
  { key: "401-500", label: "₹ 401 – ₹ 500" },
  { key: "501-max", label: "Above ₹ 500" },
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

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
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

  function clearAll() {
    setParams(new URLSearchParams());
  }

  const FiltersPanel = ({ idPrefix = "" }) => (
    <>
      <div className="mb-7">
        <div className="font-semibold text-[0.9rem] mb-[15px]">Price Range</div>
        <div className="flex flex-col gap-3">
          {PRICE_BUCKETS.map((b) => (
            <label key={b.key} className="flex items-center gap-2.5 text-[0.85rem] text-[#666] cursor-pointer">
              <input
                type="radio"
                name={`${idPrefix}price_range`}
                checked={priceRange === b.key}
                onChange={() => updateParam("price_range", b.key)}
                className="w-4 h-4 accent-accent"
              />
              <span className="flex-grow">{b.label}</span>
              <span className="text-[#999] text-[0.75rem]">({result?.priceCounts?.[b.key] ?? 0})</span>
            </label>
          ))}
          {priceRange && (
            <button onClick={() => updateParam("price_range", "")} className="text-[0.75rem] text-accent hover:underline text-left">
              Clear price filter
            </button>
          )}
        </div>
      </div>
      <div className="mb-7">
        <div className="font-semibold text-[0.9rem] mb-[15px]">Discount</div>
        <div className="flex flex-col gap-3">
          {DISCOUNTS.map((d) => (
            <label key={d} className="flex items-center gap-2.5 text-[0.85rem] text-[#666] cursor-pointer">
              <input
                type="radio"
                name={`${idPrefix}discount`}
                checked={discount === d}
                onChange={() => updateParam("discount", d)}
                className="w-4 h-4 accent-accent"
              />
              <span className="flex-grow">{d}% or more off</span>
            </label>
          ))}
          {discount && (
            <button onClick={() => updateParam("discount", "")} className="text-[0.75rem] text-accent hover:underline text-left">
              Clear discount filter
            </button>
          )}
        </div>
      </div>
      <div>
        <div className="font-semibold text-[0.9rem] mb-[15px]">Sort By</div>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full border border-border rounded-full px-4 py-3 text-[0.85rem] bg-white outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "All Products" }]} />
      <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <h1 className="relative inline-block font-serif text-2xl md:text-[1.8rem] font-normal tracking-[3px] pb-4 mb-[10px]">
            Our Collection
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[60px] h-[2px] bg-accent" />
          </h1>
          <p className="text-[#888] text-[0.9rem]">Discover our exquisite collection of handcrafted jewelry</p>
        </div>

        {search && (
          <div className="text-center mb-10 px-6 py-6 bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
            <h3 className="font-serif text-[1.3rem] mb-2.5">Search Results</h3>
            <p className="text-[#888]">
              {result ? result.total : "..."} results for{" "}
              <span className="bg-[#e8e0d4] text-accent px-1.5 py-0.5 rounded-full font-semibold">&ldquo;{search}&rdquo;</span>
            </p>
          </div>
        )}

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden w-full mb-5 bg-accent text-white rounded-full py-3.5 font-semibold flex items-center justify-center gap-2.5"
        >
          <i className="fa-solid fa-filter" /> Filters &amp; Sort
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-[30px]">
          <aside className="hidden lg:block bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] p-7 h-fit sticky top-[140px]">
            <div className="flex justify-between items-center mb-6 pb-[15px] border-b border-border">
              <h3 className="font-serif text-[1.2rem] font-medium">Filters</h3>
              <button onClick={clearAll} className="text-accent text-[0.8rem] hover:underline">
                Clear All
              </button>
            </div>
            <FiltersPanel />
          </aside>

          <section className="bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="flex flex-wrap gap-3 px-6 py-5 border-b border-border">
              {TAG_DEFS.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => updateParam("tag", t.slug)}
                  className={`px-5 py-2 rounded-full text-[0.8rem] font-medium border transition-colors whitespace-nowrap ${
                    tag === t.slug
                      ? "bg-accent text-white border-accent"
                      : "border-border text-primary hover:border-accent hover:text-accent"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="text-center py-16 text-primary/60">Loading products...</div>
            ) : (
              <ProductGrid products={result?.products} variant="shop" />
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter overlay */}
      <div
        className={`fixed inset-0 z-[170] lg:hidden transition-opacity ${
          mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/80" onClick={() => setMobileFiltersOpen(false)} />
        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white p-6 overflow-y-auto transition-transform ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-[30px] pb-5 border-b border-border">
            <h3 className="font-semibold text-lg">Filters &amp; Sort</h3>
            <button onClick={() => setMobileFiltersOpen(false)} className="icon-btn text-2xl">
              <i className="fa-solid fa-xmark" />
            </button>
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
