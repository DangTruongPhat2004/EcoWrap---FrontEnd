import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import VendorSidebar from "./VendorSidebar";
import CustomerSidebar from "./CustomerSidebar";
import AdminSidebar from "./AdminSidebar";

const RoleBasedLayout = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role);
  }, []);

  // Show loading or default layout while determining role
  if (userRole === null) {
    return <div>Loading...</div>;
  }

  // Return appropriate layout based on user role
  if (userRole === "Seller") {
    return <DashboardLayout sidebar={VendorSidebar} />;
  }

  if (userRole === "Admin") {
    return <DashboardLayout sidebar={AdminSidebar} />;
  }

  // Default to customer layout for customers and any other roles
  return <DashboardLayout sidebar={CustomerSidebar} />;
};

export default RoleBasedLayout;
