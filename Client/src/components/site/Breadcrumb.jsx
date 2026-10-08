import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="max-w-container mx-auto px-6 md:px-8 py-4 md:py-5 text-[0.82rem] text-primary/45 flex items-center flex-wrap gap-1.5">
      <Link to="/" className="transition-colors hover:text-accent" aria-label="Home">
        <i className="fa-solid fa-house text-[0.75rem]" />
      </Link>
      {items.slice(1).map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <i className="fa-solid fa-chevron-right text-[0.55rem] text-primary/25" />
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary/70 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
