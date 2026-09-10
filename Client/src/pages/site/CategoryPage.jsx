import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories } = useSiteData();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products?category=${encodeURIComponent(slug)}`)
      .then(setResult)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: category?.name?.toUpperCase() || slug.toUpperCase() }]} />
      <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <h1 className="relative inline-block font-serif text-2xl md:text-[1.8rem] font-normal tracking-[3px] uppercase pb-4 mb-[10px]">
            {category?.name || slug}
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[60px] h-[2px] bg-accent" />
          </h1>
          {!loading && result && <p className="text-[0.9rem] text-[#888]">{result.total} Products Found</p>}
        </div>
        {loading ? (
          <div className="text-center py-16 text-primary/60">Loading products...</div>
        ) : (
          <ProductGrid
            products={result?.products}
            emptyMessage={
              <>
                No products in this category yet.{" "}
                <Link to="/search" className="text-accent underline">
                  Browse all products
                </Link>
              </>
            }
          />
        )}
      </div>
    </div>
  );
}
