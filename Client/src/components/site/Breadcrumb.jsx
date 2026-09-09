import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="max-w-container mx-auto px-4 md:px-8 py-4 text-xs md:text-sm text-primary/60">
      {items.map((item, i) => (
        <span key={i}>
          {item.to ? (
            <Link to={item.to} className="hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
