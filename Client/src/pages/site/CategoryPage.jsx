import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { ProductGridSkeleton } from "../../components/site/Skeletons.jsx";

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
        <Reveal className="text-center mb-10">
          <span className="eyebrow">Collection</span>
          <h1 className="section-title mt-2 mb-5 uppercase">{category?.name || slug}</h1>
          {!loading && result && <p className="text-[0.9rem] text-primary/45">{result.total} Products Found</p>}
        </Reveal>
        {loading ? (
          <ProductGridSkeleton />
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
