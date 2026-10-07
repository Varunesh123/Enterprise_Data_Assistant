import {
    BookOpen,
    Database,
    GitBranch,
    LayoutDashboard,
    LogOut,
    Search,
    Settings,
    Sparkles,
    X,
  } from "lucide-react";
  
  import { useState } from "react";
  import { NavLink, useNavigate } from "react-router-dom";
  
  import { useAuthStore } from "../store/authStore";
  
  
  interface AppShellProps {
    children: React.ReactNode;
  }
  
  
  const navigation = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Data Catalog",
      path: "/catalog",
      icon: Database,
    },
    {
      label: "Search",
      path: "/search",
      icon: Search,
    },
    {
      label: "Relationships",
      path: "/relationships",
      icon: GitBranch,
    },
    {
      label: "AI Copilot",
      path: "/copilot",
      icon: Sparkles,
    },
  ];
  
  
  export default function AppShell({
    children,
  }: AppShellProps) {
  
    const [mobileOpen, setMobileOpen] =
      useState(false);
  
    const navigate = useNavigate();
  
    const user = useAuthStore(
      (state) => state.user,
    );
  
    const logout = useAuthStore(
      (state) => state.logout,
    );
  
  
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };
  
  
    const sidebar = (
      <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
  
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
  
          <div className="flex items-center gap-3">
  
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Database size={19} />
            </div>
  
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Data Catalog
              </p>
  
              <p className="text-[11px] text-slate-500">
                Enterprise Intelligence
              </p>
            </div>
  
          </div>
  
        </div>
  
  
        <div className="flex-1 overflow-y-auto px-3 py-5">
  
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
  
          <nav className="space-y-1">
  
            {navigation.map((item) => {
  
              const Icon = item.icon;
  
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
  
          </nav>
  
  
          <p className="mt-8 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            System
          </p>
  
          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={18} />
            Settings
          </NavLink>
  
        </div>
  
  
        <div className="border-t border-slate-200 p-3">
  
          <div className="flex items-center gap-3 rounded-lg p-2">
  
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
  
            <div className="min-w-0 flex-1">
  
              <p className="truncate text-sm font-medium text-slate-900">
                {user?.name}
              </p>
  
              <p className="truncate text-xs text-slate-500">
                {user?.team || "Member"}
              </p>
  
            </div>
  
            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <LogOut size={17} />
            </button>
  
          </div>
  
        </div>
  
      </aside>
    );
  
  
    return (
      <div className="min-h-screen bg-slate-50">
  
        <div className="hidden h-screen lg:flex">
          {sidebar}
  
          <main className="min-w-0 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
  
  
        <div className="lg:hidden">
  
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
  
            <div className="flex items-center gap-2">
  
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Database size={18} />
              </div>
  
              <span className="text-sm font-semibold">
                Data Catalog
              </span>
  
            </div>
  
            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <BookOpen size={20} />
            </button>
  
          </header>
  
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex">
  
              <div className="absolute inset-0 bg-slate-900/30" />
  
              <div className="relative">
                {sidebar}
  
                <button
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="absolute right-3 top-3 rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
  
            </div>
          )}
  
          <main>
            {children}
          </main>
  
        </div>
  
      </div>
    );
  }