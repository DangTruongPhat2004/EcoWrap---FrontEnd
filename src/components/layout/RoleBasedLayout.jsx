import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import VendorSidebar from "./VendorSidebar";
import CustomerSidebar from "./CustomerSidebar";
import AdminSidebar from "./AdminSidebar";
import { decodeJwt } from "../../utils/jwt";

const RoleBasedLayout = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get role from JWT token (more reliable than localStorage user object)
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeJwt(token);
      const role =
        payload?.[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      setUserRole(role);

      // Redirect users to their appropriate dashboard based on role
      const currentPath = location.pathname;

      if (role === "Admin" && !currentPath.startsWith("/admin")) {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "Seller" && !currentPath.startsWith("/vendor")) {
        navigate("/vendor/dashboard", { replace: true });
      } else if (
        role === "User" &&
        !currentPath.startsWith("/customer") &&
        !currentPath.startsWith("/account")
      ) {
        navigate("/", { replace: true }); // Customers go to homepage
      }
    } else {
      // Fallback to localStorage user
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserRole(user.role);
    }
  }, [navigate, location.pathname]);

  // Show loading or default layout while determining role
  if (userRole === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Return appropriate layout based on user role
  // Role names from JWT: 'Admin', 'Seller', 'User'
  if (userRole === "Seller") {
    return <DashboardLayout sidebar={VendorSidebar} />;
  }

  if (userRole === "Admin") {
    return <DashboardLayout sidebar={AdminSidebar} />;
  }

  // Default to customer layout for User role and any other roles
  return <DashboardLayout sidebar={CustomerSidebar} />;
};

export default RoleBasedLayout;
