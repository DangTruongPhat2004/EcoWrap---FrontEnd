import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardFooter from "./DashboardFooter";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
