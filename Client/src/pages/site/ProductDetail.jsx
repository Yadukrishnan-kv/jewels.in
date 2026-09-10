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
          {
            label: product.category?.name?.toUpperCase() || "Category",
            to: product.category ? `/category/${product.category.slug}` : undefined,
          },
          { label: product.name },
        ]}
      />
      <div className="max-w-container mx-auto px-3 md:px-8 pb-16">
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 bg-transparent md:bg-white rounded-none md:rounded-3xl py-3 px-0 md:p-10 shadow-none md:shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-6 md:mb-[60px]">
          {/* Gallery */}
          <div className="flex-1 md:min-w-[300px]">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              className="gallery-swiper rounded-none md:rounded-[20px] overflow-hidden bg-[#f5f2ed] aspect-square mb-4"
            >
              {(product.images?.length ? product.images : [""]).map((img, i) => (
                <SwiperSlide key={i} className="!flex items-center justify-center bg-[#f5f2ed]">
                  <img
                    src={imageUrl(img)}
                    alt={product.name}
                    onClick={() => setZoomIndex(i)}
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/600x600/f5f2ed/1a1a1a?text=The+Halla")}
                    className="w-full h-full object-contain cursor-zoom-in"
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
                className="thumb-swiper px-3 pt-2 md:px-0 md:pt-0"
              >
                {product.images.map((img, i) => (
                  <SwiperSlide
                    key={i}
                    className="!w-[60px] !h-[60px] md:!w-20 md:!h-20 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent opacity-50 [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-accent transition-all"
                  >
                    <img src={imageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 md:min-w-[300px] px-3 md:px-0">
            <div className="flex justify-between items-center gap-4">
              <h1 className="font-serif text-[22px] font-semibold tracking-[-0.5px] text-primary">{product.name}</h1>
              <button
                onClick={() =>
                  navigator.share
                    ? navigator.share({ title: product.name, url: window.location.href })
                    : navigator.clipboard.writeText(window.location.href).then(() => showToast("Link copied!"))
                }
                className="w-[38px] h-[38px] shrink-0 rounded-full bg-[#f1f1f1] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors"
                aria-label="Share"
              >
                <i className="fa-solid fa-share-nodes text-sm" />
              </button>
            </div>

            {stockState && (
              <div
                className={`inline-block mt-4 mb-5 px-3 py-[5px] rounded-full text-[0.75rem] font-semibold ${
                  stockState === "out"
                    ? "bg-[#fee2e2] text-[#991b1b]"
                    : stockState === "low"
                    ? "bg-[#fed7aa] text-[#92400e]"
                    : "bg-[#d1fae5] text-[#065f46]"
                }`}
              >
                <i className="fa-solid fa-circle-exclamation mr-1.5" />
                {stockState === "out" ? "Out of Stock" : stockState === "low" ? `Only ${variant.stock} left in stock!` : `In Stock (${variant.stock} available)`}
              </div>
            )}

            {product.variants?.length > 1 && (
              <div className="mb-6">
                <label className="block mb-[10px] font-medium text-[0.9rem] text-[#555]">Select Variant:</label>
                <select
                  value={variantIdx}
                  onChange={(e) => {
                    setVariantIdx(Number(e.target.value));
                    setQty(1);
                  }}
                  className="block w-full md:max-w-[300px] min-h-[52px] px-[18px] py-[13px] border border-border rounded-[14px] bg-white text-[#222] outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(20,46,37,0.15)]"
                >
                  {product.variants.map((v, i) => (
                    <option key={v._id} value={i}>
                      {v.label} - {formatPrice(v.discountPrice || v.price)} ({v.stock} in stock)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-baseline gap-4 flex-wrap mb-6">
              <span className="font-serif text-[1.8rem] md:text-[2rem] font-bold text-accent">{formatPrice(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-[1rem] text-[#999] line-through">{formatPrice(variant.price)}</span>
                  <span className="text-[0.75rem] font-semibold bg-[#e8e0d4] text-accent px-3 py-1 rounded-full">
                    Save {formatPrice(variant.price - variant.discountPrice)}
                  </span>
                </>
              )}
            </div>

            {stockState !== "out" && (
              <>
                <div className="mb-6">
                  <label className="block mb-[10px] font-medium text-[0.9rem] text-[#555]">Quantity:</label>
                  <div className="inline-flex items-center border border-border rounded-full bg-white">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-lg hover:text-accent"
                    >
                      -
                    </button>
                    <span className="w-[60px] text-center text-[1rem] font-semibold">{qty}</span>
                    <button
                      onClick={() => {
                        if (qty < variant.stock) setQty((q) => q + 1);
                        else showToast(`Only ${variant.stock} units available in stock!`, "warning");
                      }}
                      className="w-11 h-11 flex items-center justify-center text-lg hover:text-accent"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-3 text-[0.9rem]">
                    Subtotal: <strong className="text-accent">{formatPrice(subtotal)}</strong>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-semibold text-[0.9rem] bg-accent text-white hover:bg-accent-light hover:-translate-y-0.5 transition-all"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-semibold text-[0.9rem] bg-primary text-white hover:bg-black hover:-translate-y-0.5 transition-all"
                  >
                    BUY IT NOW
                  </button>
                </div>
              </>
            )}

            <button
              onClick={handleWishlist}
              className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-semibold text-[0.9rem] bg-white border transition-colors mb-5 ${
                isWishlisted(product._id)
                  ? "border-[#ffcdd2] text-[#c00002] hover:border-[#c00002]"
                  : "border-border text-primary hover:border-accent hover:text-accent"
              }`}
            >
              <i className={isWishlisted(product._id) ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
              {isWishlisted(product._id) ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${window.location.href})`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-semibold text-[0.9rem] bg-[#25D366] text-white hover:bg-[#128C7E] hover:-translate-y-0.5 transition-all"
            >
              <i className="fa-brands fa-whatsapp text-lg" /> CHAT WITH US
            </a>
          </div>
        </div>

        {(product.specs?.length > 0 || product.description) && (
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 md:p-10 mb-[60px]">
            <h2 className="font-serif text-[22px] font-semibold tracking-[-0.5px] mb-4">Product Details</h2>
            <div className="text-[0.95rem] leading-[1.7] text-[#444] space-y-4">
              {product.specs.map((s, i) => (
                <p key={i}>• {s}</p>
              ))}
              {product.description && <p>{product.description}</p>}
            </div>
          </div>
        )}
      </div>

      {data.related?.length > 0 && (
        <div className="max-w-container mx-auto px-3 md:px-8 pb-16">
          <h2 className="section-title">YOU MAY ALSO LIKE</h2>
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
