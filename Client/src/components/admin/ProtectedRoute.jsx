import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useAdminAuth();

  if (loading) return <div className="p-10 text-center text-primary/60">Loading...</div>;
  if (!token || !user) return <Navigate to="/admin/login" replace />;
  return children;
}
