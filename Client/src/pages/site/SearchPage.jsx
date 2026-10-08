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
  const { settings } = useSiteData();
  const titles = settings.sectionTitles || {};
  const PRICE_BUCKETS = buildPriceBuckets();
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
            <label key={b.key} className="flex items-center gap-2.5 text-[0.85rem] text-primary/65 cursor-pointer">
              <input
                type="radio"
                name={`${idPrefix}price_range`}
                checked={priceRange === b.key}
                onChange={() => updateParam("price_range", b.key)}
                className="w-4 h-4 accent-accent"
              />
              <span className="flex-grow">{b.label}</span>
              <span className="text-primary/35 text-[0.75rem]">({result?.priceCounts?.[b.key] ?? 0})</span>
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
            <label key={d} className="flex items-center gap-2.5 text-[0.85rem] text-primary/65 cursor-pointer">
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
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="field-pill appearance-none cursor-pointer pr-10"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-[0.7rem] text-primary/40 pointer-events-none" />
        </div>
      </div>
    </>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "All Products" }]} />
      <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
        <Reveal className="text-center mb-10">
          <span className="eyebrow">Browse</span>
          <h1 className="section-title mt-2 mb-5">{titles.searchPageTitle || "Our Collection"}</h1>
          <p className="text-primary/45 text-[0.9rem] max-w-md mx-auto">
            {titles.searchPageSubtitle || "Discover our exquisite collection of handcrafted jewelry"}
          </p>
        </Reveal>

        {search && (
          <Reveal className="text-center mb-10 px-6 py-6 surface-card">
            <h3 className="font-serif text-[1.3rem] mb-2.5">Search Results</h3>
            <p className="text-primary/45">
              {result ? result.total : "..."} results for{" "}
              <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">&ldquo;{search}&rdquo;</span>
            </p>
          </Reveal>
        )}

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden w-full mb-5 bg-accent text-white rounded-full py-3.5 font-semibold flex items-center justify-center gap-2.5 shadow-soft"
        >
          <i className="fa-solid fa-filter" /> Filters &amp; Sort
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-[30px]">
          <aside className="hidden lg:flex flex-col surface-card p-7 sticky top-[140px] max-h-[calc(100vh-160px)]">
            <div className="flex justify-between items-center mb-6 pb-[15px] border-b border-border shrink-0">
              <h3 className="font-serif text-[1.2rem] font-medium">Filters</h3>
              <button onClick={clearAll} className="text-accent text-[0.8rem] hover:underline">
                Clear All
              </button>
            </div>
            <div className="overflow-y-auto pr-1 -mr-1">
              <FiltersPanel />
            </div>
          </aside>

          <section className="surface-card overflow-hidden">
            <div className="relative border-b border-border">
              <div className="flex md:flex-wrap gap-3 px-6 py-5 md:pr-6 pr-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">
                {TAG_DEFS.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => updateParam("tag", t.slug)}
                    className={`shrink-0 snap-start px-5 py-2 rounded-full text-[0.8rem] font-medium border transition-all duration-300 ease-premium whitespace-nowrap ${
                      tag === t.slug
                        ? "bg-accent text-white border-accent shadow-soft"
                        : "border-border text-primary/80 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="md:hidden pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
            </div>
            {loading ? <ProductGridSkeleton variant="shop" /> : <ProductGrid products={result?.products} variant="shop" />}
          </section>
        </div>
      </div>

      {/* Mobile filter overlay */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[170] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white p-6 overflow-y-auto shadow-elevated"
            >
              <div className="flex justify-between items-center mb-[30px] pb-5 border-b border-border">
                <h3 className="font-semibold text-lg">Filters &amp; Sort</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="icon-btn text-2xl">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <FiltersPanel idPrefix="m_" />
              <button onClick={() => setMobileFiltersOpen(false)} className="btn-accent w-full justify-center mt-8">
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
