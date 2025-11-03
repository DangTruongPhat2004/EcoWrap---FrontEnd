import { Outlet } from "react-router-dom";
import DashboardFooter from "./DashboardFooter";

const DashboardLayout = ({ sidebar: SidebarComponent }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {SidebarComponent && <SidebarComponent />}

      {/* Main Content Area */}
      {/* ml-64 is for a 16rem (256px) sidebar. Adjust if your sidebars have different widths. */}
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
