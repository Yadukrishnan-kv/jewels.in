import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { api, imageUrl } from "../../api/client.js";

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:[column-gap:16px] xs:[row-gap:24px] md:[column-gap:24px] md:[row-gap:40px]">
          {data.categories.map((c) => (
            <Link key={c._id} to={`/category/${c.slug}`} className="group text-center">
              <div className="aspect-square rounded-[20px] overflow-hidden bg-[#e3d9cb] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-[5px]">
                <img
                  src={imageUrl(c.image)}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/300x300/e3d9cb/1a1a1a?text=" + encodeURIComponent(c.name))}
                  className="w-full h-full object-cover grayscale-[20%] transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <p className="mt-[14px] text-[0.95rem] font-medium tracking-[0.5px] text-[#2b2b2b] uppercase">{c.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Viral products */}
      {data.viralProducts?.length > 0 && (
        <div className="max-w-container mx-auto px-6 md:px-8 mt-16">
          <h2 className="font-serif text-xl md:text-2xl mb-4">Virals You searching for</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView="auto"
            spaceBetween={16}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-10"
          >
            {data.viralProducts.map((p) => (
              <SwiperSlide key={p._id} className="!w-[220px]">
                <Link to={`/product/${p.slug}`} className="block text-center">
                  <div className="aspect-square rounded-[20px] overflow-hidden bg-[#e2d8c8] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)]">
                    <img
                      src={imageUrl(p.image)}
                      alt={p.name}
                      className="w-full h-full object-cover grayscale-[20%] transition-transform duration-300 hover:scale-105 hover:grayscale-0"
                    />
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

      {/* For Minimal Girlies — heading only; the original site's grid here is empty
          (no products tagged) and the two promo boxes follow immediately */}
      <div className="max-w-container mx-auto px-6 md:px-8 mt-16">
        <h2 className="section-title mb-0">For Minimal Girlies</h2>
      </div>

      {/* Mid promo: Elegance / Soft Sensual Stunning */}
      {midPromo.length > 0 && (
        <section className="max-w-container mx-auto px-6 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-[30px]">
          {midPromo.map((b) => (
            <div
              key={b._id}
              className="relative rounded-2xl overflow-hidden min-h-[220px] md:min-h-[280px] flex flex-col items-start justify-end text-left p-6 md:p-[35px]"
              style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(${imageUrl(b.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-white font-serif text-xl md:text-2xl mb-3">{b.title}</h3>
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
              className="testimonial-swiper pb-10"
            >
              {data.testimonials.map((t) => (
                <SwiperSlide key={t._id}>
                  <div className="bg-[#fefaf3] border border-[#ddd0bc] rounded-3xl p-4">
                    <img
                      src={imageUrl(t.image)}
                      alt="Testimonial"
                      className="w-full aspect-[1/0.9] object-cover rounded-2xl grayscale-[30%] transition-[filter] hover:grayscale-0"
                    />
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
        <div className="max-w-container mx-auto px-6 md:px-8 mt-10">
          <p className="text-center font-serif italic text-[1.6rem] font-medium text-accent tracking-[-0.5px] mb-5">
            Slaying in the Style
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {story.map((s) => (
              <div
                key={s._id}
                className="flex-none w-[140px] bg-secondary border border-[#d9cebc] rounded-3xl overflow-hidden shadow-[0_6px_14px_rgba(0,0,0,0.03)]"
              >
                <img
                  src={imageUrl(s.image)}
                  alt={s.title || ""}
                  className="w-full aspect-square object-cover grayscale-[30%] transition-[filter] hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
