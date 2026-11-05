import ProductCard from "./ProductCard.jsx";
import { RevealGroup, RevealItem } from "./Reveal.jsx";

const GRID = {
  home: "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12",
  shop: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14",
  listing: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12",
};

export default function ProductGrid({ products, emptyMessage = "No products found.", variant = "listing" }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full border border-border/60 bg-white/50 py-20 px-6 text-center">
        <div className="w-14 h-14 mx-auto mb-5 border border-border/70 text-primary/30 flex items-center justify-center">
          <i className="fa-regular fa-face-frown" />
        </div>
        <p className="micro text-primary/40 mb-2">Nothing here yet</p>
        <p className="font-serif text-lg text-primary/60">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <RevealGroup className={GRID[variant] || GRID.listing} stagger={0.05} mount>
      {products.map((p) => (
        <RevealItem key={p._id}>
          <ProductCard product={p} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
