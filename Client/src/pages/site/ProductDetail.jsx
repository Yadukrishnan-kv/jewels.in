import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { api, imageUrl } from "../../api/client.js";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";

function formatPrice(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(null);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    setData(null);
    setVariantIdx(0);
    setQty(1);
    setZoomIndex(null);
    api.get(`/products/${slug}`).then(setData).catch(() => setData(false));
    window.scrollTo(0, 0);
  }, [slug]);

  const product = data?.product;
  const variant = product?.variants?.[variantIdx];

  const stockState = useMemo(() => {
    if (!variant) return null;
    if (variant.stock <= 0) return "out";
    if (variant.stock <= 10) return "low";
    return "in";
  }, [variant]);

  if (data === false) {
    return <div className="py-24 text-center text-primary/60">Product not found.</div>;
  }
  if (!data) {
    return <div className="py-24 text-center text-primary/60">Loading...</div>;
  }

  function handleAddToCart(andBuyNow) {
    if (!variant || variant.stock <= 0) return;
    if (qty > variant.stock) {
      showToast(`Only ${variant.stock} units available in stock!`, "error");
      return;
    }
    addItem(product, variant, qty);
    if (andBuyNow) navigate("/cart");
  }

  function handleWishlist() {
    toggle(product);
  }

  const price = variant?.discountPrice || variant?.price || 0;
  const hasDiscount = variant?.discountPrice > 0;
  const subtotal = price * qty;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: product.category?.name || "Category", to: product.category ? `/category/${product.category.slug}` : undefined },
          { label: product.name },
        ]}
      />
      <div className="max-w-container mx-auto px-4 md:px-8 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            className="rounded-2xl overflow-hidden bg-white aspect-square mb-3"
          >
            {(product.images?.length ? product.images : [""]).map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={imageUrl(img)}
                  alt={product.name}
                  onClick={() => setZoomIndex(i)}
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/600x600/efede9/1a1a1a?text=The+Halla")}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {product.images?.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[Thumbs]}
              slidesPerView={4}
              spaceBetween={10}
              watchSlidesProgress
              className="thumb-swiper"
            >
              {product.images.map((img, i) => (
                <SwiperSlide key={i} className="rounded-lg overflow-hidden aspect-square cursor-pointer border border-border/60">
                  <img src={imageUrl(img)} alt="" className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex justify-between items-start gap-4">
            <h1 className="font-serif text-2xl md:text-3xl">{product.name}</h1>
            <button
              onClick={() => navigator.share ? navigator.share({ title: product.name, url: window.location.href }) : navigator.clipboard.writeText(window.location.href).then(() => showToast("Link copied!"))}
              className="icon-btn text-lg"
              aria-label="Share"
            >
              <i className="fa-solid fa-share-nodes" />
            </button>
          </div>

          {stockState && (
            <div
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                stockState === "out"
                  ? "bg-red-100 text-red-700"
                  : stockState === "low"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {stockState === "out" ? "Out of Stock" : stockState === "low" ? `Only ${variant.stock} left in stock!` : `In Stock (${variant.stock} available)`}
            </div>
          )}

          {product.variants?.length > 1 && (
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">Select Variant:</label>
              <select
                value={variantIdx}
                onChange={(e) => {
                  setVariantIdx(Number(e.target.value));
                  setQty(1);
                }}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              >
                {product.variants.map((v, i) => (
                  <option key={v._id} value={i}>
                    {v.label} - {formatPrice(v.discountPrice || v.price)} ({v.stock} in stock)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPrice(price)}</span>
            {hasDiscount && (
              <>
                <span className="text-primary/40 line-through">{formatPrice(variant.price)}</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                  Save {formatPrice(variant.price - variant.discountPrice)}
                </span>
              </>
            )}
          </div>

          {stockState !== "out" && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-secondary"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => {
                      if (qty < variant.stock) setQty((q) => q + 1);
                      else showToast(`Only ${variant.stock} units available in stock!`, "warning");
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-secondary"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-primary/60">
                  Subtotal: <strong className="text-primary">{formatPrice(subtotal)}</strong>
                </span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleAddToCart(false)} className="btn-outline flex-1 justify-center">
                  <i className="fa-solid fa-bag-shopping" /> Add to Cart
                </button>
                <button onClick={() => handleAddToCart(true)} className="btn-primary flex-1 justify-center">
                  Buy it Now
                </button>
              </div>
            </>
          )}

          <button onClick={handleWishlist} className="btn-outline w-full justify-center mt-3">
            <i className={isWishlisted(product._id) ? "fa-solid fa-heart text-accent" : "fa-regular fa-heart"} />
            {isWishlisted(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${window.location.href})`)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 text-sm text-[#25D366] font-medium py-2"
          >
            <i className="fa-brands fa-whatsapp text-lg" /> CHAT WITH US
          </a>

          {product.specs?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h2 className="font-semibold mb-3">Product Details</h2>
              <ul className="space-y-1 text-sm text-primary/70 list-disc list-inside">
                {product.specs.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              {product.description && <p className="text-sm text-primary/70 mt-3">{product.description}</p>}
            </div>
          )}
        </div>
      </div>

      {data.related?.length > 0 && (
        <div className="max-w-container mx-auto px-4 md:px-8 pb-16">
          <h2 className="section-title">You May Also Like</h2>
          <ProductGrid products={data.related} />
        </div>
      )}

      {zoomIndex !== null && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomIndex(null)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setZoomIndex(null)}>
            <i className="fa-solid fa-xmark" />
          </button>
          <img
            src={imageUrl(product.images[zoomIndex])}
            alt={product.name}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
