import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { ProductGridSkeleton } from "../../components/site/Skeletons.jsx";
import { getCurrencySymbol } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";

function buildPriceBuckets() {
  const c = getCurrencySymbol();
  return [
    { key: "0-100", label: `${c} 0 – ${c} 100` },
    { key: "101-200", label: `${c} 101 – ${c} 200` },
    { key: "201-300", label: `${c} 201 – ${c} 300` },
    { key: "301-400", label: `${c} 301 – ${c} 400` },
    { key: "401-500", label: `${c} 401 – ${c} 500` },
    { key: "501-max", label: `Above ${c} 500` },
  ];
}

const DISCOUNTS = ["50", "30", "20", "10"];

const FALLBACK_TAGS = [
  { name: "All", slug: "" },
  { name: "For Minimal Girlies", slug: "for-minimal-girlies" },
  { name: "Virals You searching for", slug: "virals-you-searching-for" },
  { name: "Silver Collections", slug: "silver-collections" },
  { name: "Under 199", slug: "under-199" },
  { name: "Elegance in every drop", slug: "elegance-in-every-drop" },
  { name: "Soft. Sensual. Stunning.", slug: "soft-sensual-stunning" },
  { name: "Luxe in Hala", slug: "luxe-in-hala" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

function Pagination({ page, totalPages, onPage }) {
  if (!totalPages || totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-14 md:mt-20">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 border border-border/70 bg-white text-primary/60 flex items-center justify-center text-[0.7rem] hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <i className="fa-solid fa-arrow-left" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-10 h-10 border flex items-center justify-center text-[0.75rem] font-medium tabular-nums transition-colors ${
            p === page
              ? "bg-accent text-white border-accent"
              : "border-border/70 bg-white text-primary/60 hover:border-primary/40"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="w-10 h-10 border border-border/70 bg-white text-primary/60 flex items-center justify-center text-[0.7rem] hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <i className="fa-solid fa-arrow-right" />
      </button>
    </div>
  );
}

export default function SearchPage() {
  const { settings } = useSiteData();
  const titles = settings.sectionTitles || {};
  const PRICE_BUCKETS = buildPriceBuckets();
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [tags, setTags] = useState(FALLBACK_TAGS);

  const search = params.get("search") || "";
  const tag = params.get("tag") || "";
  const priceRange = params.get("price_range") || "";
  const discount = params.get("discount") || "";
  const sort = params.get("sort") || "featured";
  const page = Number(params.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    api
      .get("/tags")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTags([{ name: "All", slug: "" }, ...data]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (tag) qs.set("tag", tag);
    if (sort) qs.set("sort", sort);
    if (discount) qs.set("discount", discount);
    if (page > 1) qs.set("page", String(page));
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      qs.set("price_min", min);
      if (max !== "max") qs.set("price_max", max);
    }
    api
      .get(`/products?${qs.toString()}`)
      .then(setResult)
      .catch(() => setResult({ products: [], total: 0, totalPages: 1, page: 1 }))
      .finally(() => setLoading(false));
  }, [search, tag, priceRange, discount, sort, page]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  function clearAll() {
    setParams(new URLSearchParams());
  }

  function searchSubmit(e) {
    e.preventDefault();
    const q = searchInput.trim();
    setParams(q ? new URLSearchParams({ search: q }) : new URLSearchParams());
  }

  const FiltersPanel = ({ idPrefix = "" }) => (
    <>
      <div className="mb-8">
        <div className="micro text-primary/40 mb-4">Collection</div>
        <div className="flex flex-col">
          {tags.map((t) => (
            <button
              key={t.slug || "all"}
              onClick={() => updateParam("tag", t.slug)}
              className={`flex items-center justify-between gap-3 py-2.5 border-b border-border/50 text-left text-[0.85rem] transition-colors ${
                tag === t.slug ? "text-accent font-medium" : "text-primary/65 hover:text-primary"
              }`}
            >
              {t.name}
              {tag === t.slug && <i className="fa-solid fa-check text-[0.6rem]" />}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="micro text-primary/40 mb-4">Price Range</div>
        <div className="flex flex-col">
          {PRICE_BUCKETS.map((b) => (
            <label
              key={b.key}
              className="flex items-center gap-3 py-2 border-b border-border/50 text-[0.85rem] text-primary/65 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="radio"
                name={`${idPrefix}price_range`}
                checked={priceRange === b.key}
                onChange={() => updateParam("price_range", b.key)}
                className="w-3.5 h-3.5 accent-accent"
              />
              <span className="flex-grow">{b.label}</span>
              <span className="text-primary/30 text-[0.72rem] tabular-nums">({result?.priceCounts?.[b.key] ?? 0})</span>
            </label>
          ))}
          {priceRange && (
            <button onClick={() => updateParam("price_range", "")} className="micro text-accent hover:underline text-left mt-3">
              Clear price
            </button>
          )}
        </div>
      </div>
      <div className="mb-8">
        <div className="micro text-primary/40 mb-4">Discount</div>
        <div className="flex flex-col">
          {DISCOUNTS.map((d) => (
            <label
              key={d}
              className="flex items-center gap-3 py-2 border-b border-border/50 text-[0.85rem] text-primary/65 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="radio"
                name={`${idPrefix}discount`}
                checked={discount === d}
                onChange={() => updateParam("discount", d)}
                className="w-3.5 h-3.5 accent-accent"
              />
              <span className="flex-grow">{d}% or more off</span>
            </label>
          ))}
          {discount && (
            <button onClick={() => updateParam("discount", "")} className="micro text-accent hover:underline text-left mt-3">
              Clear discount
            </button>
          )}
        </div>
      </div>
      <div>
        <label className="micro text-primary/40 mb-3 block" htmlFor={`${idPrefix}sort`}>
          Sort By
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}sort`}
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="field appearance-none cursor-pointer pr-10 py-3"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] text-primary/40 pointer-events-none" />
        </div>
      </div>
    </>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "All Products" }]} />

      {/* Header band */}
      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <Reveal>
              <span className="eyebrow">Browse</span>
              <h1 className="section-title mt-4">
                {search ? `“${search}”` : titles.searchPageTitle || "Our Collection"}
              </h1>
              <p className="section-subtitle mt-4 text-[0.9rem]">
                {titles.searchPageSubtitle || "Discover our exquisite collection of handcrafted jewelry"}
              </p>
            </Reveal>
            {!loading && result && (
              <p className="micro text-primary/40 tabular-nums shrink-0">
                {result.total} {result.total === 1 ? "result" : "results"}
              </p>
            )}
          </div>
          <form onSubmit={searchSubmit} className="relative mt-7 w-full md:w-[540px]">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 text-[0.9rem] pointer-events-none" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              className="field w-full pl-11 pr-4 py-3.5 text-[0.95rem]"
            />
          </form>
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* Tag chips */}
        <div className="relative mb-8 md:mb-10">
          <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory pb-1 md:pb-0 pr-10 md:pr-0">
            {tags.map((t) => (
              <button
                key={t.slug || "all"}
                onClick={() => updateParam("tag", t.slug)}
                className={`shrink-0 snap-start micro px-4 py-2.5 border transition-all duration-300 ease-premium whitespace-nowrap ${
                  tag === t.slug
                    ? "bg-primary text-secondary border-primary"
                    : "border-border/70 bg-white text-primary/60 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="md:hidden pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-secondary to-transparent" />
        </div>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden w-full mb-6 micro bg-primary text-secondary rounded-[2px] py-4 flex items-center justify-center gap-2.5"
        >
          <i className="fa-solid fa-filter text-[0.65rem]" /> Filters &amp; Sort
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-12">
          <aside className="hidden lg:block sticky top-[92px] self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between mb-7 pb-4 border-b border-primary/15">
              <h3 className="micro text-primary">Filters</h3>
              <button onClick={clearAll} className="micro text-primary/40 hover:text-accent transition-colors">
                Clear All
              </button>
            </div>
            <FiltersPanel />
          </aside>

          <section>
            {loading ? <ProductGridSkeleton variant="shop" count={8} /> : <ProductGrid products={result?.products} variant="shop" />}
            {!loading && result && (
              <Pagination
                page={result.page || page}
                totalPages={result.totalPages}
                onPage={(p) => {
                  updateParam("page", p > 1 ? String(p) : "");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[170] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="absolute top-0 left-0 h-full w-[88%] max-w-[340px] bg-secondary overflow-y-auto shadow-elevated"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-border/60 sticky top-0 bg-secondary z-10">
                <h3 className="micro">Filters &amp; Sort</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="icon-btn text-xl w-10 h-10" aria-label="Close filters">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <div className="px-6 py-7">
                <FiltersPanel idPrefix="m_" />
                <button onClick={() => setMobileFiltersOpen(false)} className="btn-accent w-full justify-center mt-8">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
