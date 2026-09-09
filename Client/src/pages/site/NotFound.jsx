import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-container mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-4xl mb-4">404</h1>
      <p className="text-primary/60 mb-6">Page not found.</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
