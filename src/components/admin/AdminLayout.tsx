import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, ShoppingCart, Settings, LogOut, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Páginas", href: "/admin/pages" },
    { icon: ShoppingCart, label: "Checkouts", href: "/admin/checkouts" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Painel Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <LogOut className="w-4 h-4" />
              Ver Site Público
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-background flex items-center px-8 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="md:hidden">
              <Settings className="w-6 h-6 text-primary" />
            </Link>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {menuItems.find(i => i.href === location.pathname)?.label || "Admin"}
            </h2>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};