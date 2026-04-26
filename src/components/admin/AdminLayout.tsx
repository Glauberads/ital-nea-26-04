import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Share2,
  MessageSquareQuote,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import "@/styles/admin-theme.css";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Leads", icon: Users, path: "/admin/leads" },
  { label: "Formulário", icon: FileText, path: "/admin/formulario" },
  { label: "Mídia", icon: Image, path: "/admin/midia" },
  { label: "Redes Sociais", icon: Share2, path: "/admin/redes-sociais" },
  { label: "Depoimentos", icon: MessageSquareQuote, path: "/admin/depoimentos" },
  { label: "Personalização", icon: Palette, path: "/admin/personalizacao" },
  { label: "Marketing", icon: Settings, path: "/admin/marketing" },
];

const AdminLayout = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="admin-futuristic-theme min-h-screen bg-zinc-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "admin-sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-zinc-800">
          <h1 className="sidebar-brand text-xl font-bold text-zinc-100">Metta Italínea</h1>
          <p className="sidebar-subtitle text-xs text-zinc-500 mt-1">Painel Administrativo</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "active"
                    : ""
                )}
              >
                <item.icon className="nav-icon w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="sidebar-email text-xs text-zinc-500 mb-3 truncate">{user.email}</div>
          <button
            onClick={handleSignOut}
            className="signout-btn w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-zinc-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="admin-mobile-header h-14 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-400">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="ml-3 text-zinc-100 font-semibold">Metta Italínea</span>
        </header>
        <main className="admin-main flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
