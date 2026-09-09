import { Link } from "react-router-dom";
import { imageUrl } from "../../api/client.js";

function formatPrice(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-border/60 hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-accent text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          src={imageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/400x400/efede9/1a1a1a?text=The+Halla")}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-primary/40 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
