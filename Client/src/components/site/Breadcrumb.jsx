import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="max-w-container mx-auto px-6 md:px-8 py-4 md:py-5 text-[0.85rem] text-[#6b6b6b]">
      {items.map((item, i) => (
        <span key={i}>
          {item.to ? (
            <Link to={item.to} className="text-accent hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#6b6b6b]">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-2 text-[#b8ab93]">/</span>}
        </span>
      ))}
    </nav>
  );
}
