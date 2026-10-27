import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { ProductGridSkeleton } from "../../components/site/Skeletons.jsx";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories } = useSiteData();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    setSort("featured");
    setPage(1);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams({ category: slug, sort });
    if (page > 1) qs.set("page", String(page));
    api
      .get(`/products?${qs.toString()}`)
      .then(setResult)
      .catch(() => setResult({ products: [], total: 0, totalPages: 1, page: 1 }))
      .finally(() => setLoading(false));
  }, [slug, sort, page]);

  const totalPages = result?.totalPages || 1;
  const currentPage = result?.page || page;

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: category?.name || slug }]} />

      {/* Header band */}
      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <Reveal>
            <span className="eyebrow">Collection</span>
            <h1 className="section-title mt-4">{category?.name || slug}</h1>
          </Reveal>
          <div className="flex items-center gap-5 shrink-0">
            {!loading && result && (
              <p className="micro text-primary/40 tabular-nums">
                {result.total} {result.total === 1 ? "piece" : "pieces"}
              </p>
            )}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                aria-label="Sort products"
                className="field appearance-none cursor-pointer pr-10 py-2.5 text-[0.8rem] min-w-[190px]"
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
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <>
            <ProductGrid
              products={result?.products}
              emptyMessage={
                <>
                  No products in this category yet.{" "}
                  <Link to="/search" className="text-accent underline underline-offset-4">
                    Browse all products
                  </Link>
                </>
              }
            />
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-14 md:mt-20">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage <= 1}
                  className="w-10 h-10 border border-border/70 bg-white text-primary/60 flex items-center justify-center text-[0.7rem] hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <i className="fa-solid fa-arrow-left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-10 h-10 border flex items-center justify-center text-[0.75rem] font-medium tabular-nums transition-colors ${
                      p === currentPage
                        ? "bg-accent text-white border-accent"
                        : "border-border/70 bg-white text-primary/60 hover:border-primary/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage >= totalPages}
                  className="w-10 h-10 border border-border/70 bg-white text-primary/60 flex items-center justify-center text-[0.7rem] hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
