import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="max-w-container mx-auto px-5 md:px-8 py-5 md:py-6 micro text-primary/40 flex items-center flex-wrap gap-2.5 uppercase">
      <Link to="/" className="transition-colors hover:text-accent" aria-label="Home">
        Home
      </Link>
      {items.slice(1).map((item, i) => (
        <span key={i} className="flex items-center gap-2.5">
          <span className="w-3 h-px bg-primary/20" aria-hidden />
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary/70">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
