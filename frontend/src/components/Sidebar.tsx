import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, Package, ClipboardList, LogOut } from "lucide-react";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size: number }>;
  end?: boolean;
  roles: ("admin" | "employee")[];
}

const NAVIGATION_CONFIG: NavigationItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
    roles: ["admin", "employee"],
  },
  { path: "/inventory", label: "Inventory", icon: Package, roles: ["admin"] },
  {
    path: "/requests",
    label: "Requests",
    icon: ClipboardList,
    roles: ["admin", "employee"],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const allowedNavItems = NAVIGATION_CONFIG.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  return (
    <aside className="w-64 border-r border-[#1e293b] bg-[#0f172a] flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Package size={18} />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            StockCenter
          </span>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold px-1.5 py-0.5 rounded-md border border-indigo-500/20">
            v1.0
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {allowedNavItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                  }`
                }
              >
                <IconComponent size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#1e293b] pt-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
            {user?.name
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "US"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200 truncate m-0">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 capitalize m-0">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors border-none cursor-pointer text-left bg-transparent"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
