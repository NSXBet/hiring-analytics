import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Overview", subtitle: "Overview of closed and ongoing positions" },
  "/performance": { title: "Performance by Directorate", subtitle: "Hiring analysis by area" },
  "/recruiters": { title: "Recruiters", subtitle: "Recruiter performance" },
  "/hiring-managers": { title: "Hiring Managers", subtitle: "Analysis by hiring manager" },
  "/geography": { title: "Geography", subtitle: "Geographic distribution of positions" },
  "/diversity": { title: "Diversity", subtitle: "Diversity and inclusion metrics" },
  "/levels": { title: "Levels", subtitle: "Hires distribution by level and directorate" },
  "/contracts": { title: "Contracts", subtitle: "Contract distribution and breakdown by directorate" },
  "/details": { title: "Details", subtitle: "Complete requisitions table" },
  "/secondary-status": { title: "Secondary Status", subtitle: "Secondary status analysis" },
};

const Layout = () => {
  const location = useLocation();
  const { title, subtitle } = pageTitles[location.pathname] || { title: "Dashboard", subtitle: "" };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
