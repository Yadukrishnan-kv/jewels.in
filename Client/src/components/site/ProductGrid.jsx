import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, emptyMessage = "No products found." }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-16 text-primary/60">
        <i className="fa-regular fa-face-frown text-3xl mb-3 block" />
        <p>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
