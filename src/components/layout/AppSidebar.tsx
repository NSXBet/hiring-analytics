import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserCog,
  Globe,
  PieChart,
  Table2,
  AlertCircle,
  Layers,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: "Overview", path: "/", icon: LayoutDashboard },
  { title: "Performance", path: "/performance", icon: BarChart3 },
  { title: "Recruiters", path: "/recruiters", icon: Users },
  { title: "Hiring Managers", path: "/hiring-managers", icon: UserCog },
  { title: "Geography", path: "/geography", icon: Globe },
  { title: "Diversity", path: "/diversity", icon: PieChart },
  { title: "Levels", path: "/levels", icon: Layers },
  { title: "Contracts", path: "/contracts", icon: FileText },
  { title: "Details", path: "/details", icon: Table2 },
  { title: "Secondary Status", path: "/secondary-status", icon: AlertCircle },
];

const AppSidebar = () => (
  <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-sidebar border-sidebar-border fixed left-0 top-0 z-40">
    <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <BarChart3 className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold leading-tight text-sidebar-foreground">Hiring Analytics</span>
        <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Dashboard</span>
      </div>
    </div>

    <nav className="flex-1 overflow-auto py-4 px-3">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    <div className="border-t border-sidebar-border p-4">
      <p className="text-xs text-sidebar-foreground/50">© 2025 Hiring Analytics</p>
    </div>
  </aside>
);

export default AppSidebar;
