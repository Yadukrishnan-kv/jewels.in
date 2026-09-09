import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
    onClose();
    setQuery("");
  }

  return (
    <div
      className={`fixed inset-0 z-[150] transition-opacity ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute top-0 left-0 right-0 bg-white p-6 shadow-xl transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <form onSubmit={submit} className="max-w-container mx-auto flex items-center gap-3">
          <i className="fa-solid fa-magnifying-glass text-lg text-primary/60" />
          <input
            autoFocus={open}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search Products"
            className="flex-1 border-b border-border py-2 text-lg outline-none focus:border-accent bg-transparent"
          />
          <button type="button" onClick={onClose} className="icon-btn text-xl" aria-label="Close search">
            <i className="fa-solid fa-xmark" />
          </button>
        </form>
      </div>
    </div>
  );
}
