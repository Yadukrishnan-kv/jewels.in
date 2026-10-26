import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <span className="relative flex h-10 w-10">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30" />
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <i className="fa-solid fa-gem text-sm" />
          </span>
        </span>
      </div>
    );
  }
  if (!token || !user) return <Navigate to="/admin/login" replace />;
  return children;
}
