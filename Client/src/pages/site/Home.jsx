import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { api, imageUrl } from "../../api/client.js";
import ProductGrid from "../../components/site/ProductGrid.jsx";

function bannersOf(banners, section) {
  return (banners || []).filter((b) => b.section === section).sort((a, b) => a.sortOrder - b.sortOrder);
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/homepage")
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <div className="py-24 text-center text-primary/60">Could not load homepage content. Is the API running?</div>;
  }
  if (!data) {
    return <div className="py-24 text-center text-primary/60">Loading...</div>;
  }

  const hero = bannersOf(data.banners, "hero")[0];
  const promoLarge = bannersOf(data.banners, "promo-large")[0];
  const promoSmall = bannersOf(data.banners, "promo-small");
  const midPromo = bannersOf(data.banners, "mid-promo");
  const story = bannersOf(data.banners, "story");

  return (
    <div>
      {hero && (
        <section className="w-full overflow-hidden bg-[#e8dfcf] relative">
          <img
            src={imageUrl(hero.image)}
            alt={hero.title}
            className="w-full max-h-[70vh] object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </section>
      )}

      {/* Collections */}
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px bg-border" />
          <h2 className="font-serif text-2xl md:text-3xl text-center">Collections</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-5">
          {data.categories.map((c) => (
            <Link key={c._id} to={`/category/${c.slug}`} className="group text-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-border/60">
                <img
                  src={imageUrl(c.image)}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/300x300/efede9/1a1a1a?text=" + encodeURIComponent(c.name))}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="mt-2 text-xs md:text-sm font-medium uppercase tracking-wide">{c.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Viral products */}
      {data.viralProducts?.length > 0 && (
        <div className="max-w-container mx-auto px-4 md:px-8 mt-16">
          <h2 className="font-serif text-xl md:text-2xl mb-4">Virals You searching for</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={2.2}
            spaceBetween={16}
            breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-10"
          >
            {data.viralProducts.map((p) => (
              <SwiperSlide key={p._id}>
                <Link to={`/product/${p.slug}`} className="block text-center">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-border/60">
                    <img src={imageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-2 text-sm font-medium">{p.name}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Promo grid: Luxe in Hala / Silver / Under 199 */}
      {(promoLarge || promoSmall.length > 0) && (
        <section className="max-w-container mx-auto px-4 md:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoLarge && (
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] md:aspect-auto">
              <img src={imageUrl(promoLarge.image)} alt={promoLarge.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6">
                <span className="text-white text-xl font-serif mb-3">{promoLarge.title}</span>
                <Link to={promoLarge.linkUrl || "/search"} className="pill-button w-fit">
                  {promoLarge.ctaLabel || "Shop now"} →
                </Link>
              </div>
            </div>
          )}
          <div className="grid grid-rows-2 gap-4">
            {promoSmall.map((b) => (
              <div key={b._id} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img src={imageUrl(b.image)} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white font-serif mb-2">{b.title}</span>
                  <Link to={b.linkUrl || "/search"} className="pill-button text-xs w-fit px-3 py-1.5">
                    {b.ctaLabel || "Shop now"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* For Minimal Girlies */}
      {data.minimalGirlies?.length > 0 && (
        <div className="max-w-container mx-auto px-4 md:px-8 mt-16">
          <h2 className="section-title">For Minimal Girlies</h2>
          <ProductGrid products={data.minimalGirlies} />
        </div>
      )}

      {/* Mid promo: Elegance / Soft Sensual Stunning */}
      {midPromo.length > 0 && (
        <section className="max-w-container mx-auto px-4 md:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          {midPromo.map((b) => (
            <div
              key={b._id}
              className="relative rounded-2xl overflow-hidden aspect-[16/9] flex flex-col items-center justify-center text-center p-8"
              style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url(${imageUrl(b.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-white font-serif text-2xl mb-3">{b.title}</h3>
              <Link to={b.linkUrl || "/search"} className="pill-button">
                {b.ctaLabel || "Discover More"}
              </Link>
            </div>
          ))}
        </section>
      )}

      {/* Testimonials */}
      {data.testimonials?.length > 0 && (
        <div className="max-w-container mx-auto px-4 md:px-8 mt-16">
          <div className="bg-secondary rounded-[32px] p-5 md:p-8">
            <h2 className="section-title">Our DMs Say It All</h2>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              slidesPerView={1}
              spaceBetween={20}
              loop
              autoplay={{ delay: 4000 }}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="pb-10"
            >
              {data.testimonials.map((t) => (
                <SwiperSlide key={t._id}>
                  <div className="bg-[#fefaf3] border border-[#ddd0bc] rounded-3xl overflow-hidden">
                    <img src={imageUrl(t.image)} alt="Testimonial" className="w-full object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="text-center mt-6">
              <a
                href="https://instagram.com/halajewells"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                <i className="fa-brands fa-instagram" /> Visit our Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Story grid */}
      {story.length > 0 && (
        <div className="max-w-container mx-auto px-4 md:px-8 mt-16">
          <p className="text-center font-serif text-xl mb-6">Slaying in the Style</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {story.map((s) => (
              <div key={s._id} className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={imageUrl(s.image)} alt={s.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reels */}
      {data.reels?.length > 0 && (
        <div className="max-w-container mx-auto px-4 md:px-8 my-16">
          <p className="text-center font-serif text-xl mb-6">As Seen On Reels</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {data.reels.map((r) => (
              <div key={r._id} className="aspect-[9/16] rounded-2xl overflow-hidden bg-black">
                <iframe src={r.embedUrl} title="Reel" frameBorder="0" scrolling="no" className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
