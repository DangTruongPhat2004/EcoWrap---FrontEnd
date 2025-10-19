import { Navigate } from "react-router-dom";
import { decodeJwt } from "../utils/jwt";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Get user and auth status from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Decode JWT to get role from token
  const payload = decodeJwt(token);
  const userRole =
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    user.role;

  // Check if specific role is required
  // Role names from DB: 'Admin', 'Customer', 'Seller'
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
