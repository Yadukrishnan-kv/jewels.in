import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="relative flex h-10 w-10">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30" />
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <i className="fa-solid fa-gem text-sm" />
          </span>
        </span>
      </div>
    );
  }

  if (!token || !user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
