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
      <div className="max-w-container mx-auto px-4 md:px-8 pb-16">
        <div className="mb-6">
          <h1 className="font-serif text-2xl md:text-3xl">{category?.name || slug}</h1>
          {!loading && result && <p className="text-sm text-primary/60 mt-1">{result.total} Products Found</p>}
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
