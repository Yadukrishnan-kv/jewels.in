import ProductCard from "./ProductCard.jsx";
import { RevealGroup, RevealItem } from "./Reveal.jsx";

export default function ProductGrid({ products, emptyMessage = "No products found.", variant = "listing" }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-20 px-5">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent/[0.08] text-accent flex items-center justify-center text-2xl">
          <i className="fa-regular fa-face-frown" />
        </div>
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
    <RevealGroup className={gridClasses} stagger={0.05} amount={0.1}>
      {products.map((p) => (
        <RevealItem key={p._id}>
          <ProductCard product={p} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
