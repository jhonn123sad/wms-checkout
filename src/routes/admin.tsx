import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingCart, FileText, Settings, LogOut, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate({ to: "/admin/login" });
        return;
      }

      // Verifica se o usuário é um admin ativo
      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("active")
        .eq("user_id", session.user.id)
        .single();

      if (error || !admin?.active) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    }

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso não autorizado</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Você não tem permissão para acessar o painel administrativo.</p>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Sair e voltar ao login
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-b md:border-r border-border p-6 flex flex-col gap-6 sticky top-0 h-screen">
        <div className="font-bold text-xl flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Admin CMS
        </div>
        
        <nav className="flex flex-col gap-1">
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            to="/admin/pages" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <FileText className="w-4 h-4" />
            Páginas
          </Link>
          <Link 
            to="/admin/checkouts" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            Checkouts
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-border flex flex-col gap-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Ir para o Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-muted/10">
        <Outlet />
      </main>
    </div>
  );
}
