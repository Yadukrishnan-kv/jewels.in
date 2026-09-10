import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, emptyMessage = "No products found.", variant = "listing" }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-16 px-5">
        <i className="fa-regular fa-face-frown text-3xl mb-3 block text-primary/40" />
        <p className="font-serif text-lg text-primary/50">{emptyMessage}</p>
      </div>
    );
  }
  const gridClasses =
    variant === "home"
      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-[30px]"
      : variant === "shop"
      ? "grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 xs:gap-4 md:gap-6 p-3 xs:p-4 md:p-6"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-5 lg:gap-6 p-px xs:p-5 md:p-6 lg:p-[30px]";
  return (
    <div className={gridClasses}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
