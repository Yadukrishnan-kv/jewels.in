export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[3/4]" />
      <div className="pt-4 space-y-2.5">
        <div className="skeleton h-3.5 w-4/5" />
        <div className="skeleton h-3.5 w-2/5" />
      </div>
    </div>
  );
}

const GRID = {
  home: "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12",
  shop: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14",
  listing: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12",
};

export function ProductGridSkeleton({ count = 8, variant = "listing" }) {
  return (
    <div className={GRID[variant] || GRID.listing}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-28 text-primary/45">
      <span className="relative flex h-10 w-10">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/25" />
        <span className="relative inline-flex h-10 w-10 items-center justify-center bg-accent/10 text-accent">
          <i className="fa-solid fa-gem text-sm" />
        </span>
      </span>
      <p className="micro">{label}</p>
    </div>
  );
}
