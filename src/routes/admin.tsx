 import { useEffect, useState, ReactNode } from "react";
 import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
 import { LayoutDashboard, Settings, LogOut, Briefcase, AlertTriangle, Loader2 } from "lucide-react";
 import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
 
 function AdminErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
   const router = useRouter();
   return (
     <div className="p-8">
       <Alert variant="destructive">
         <AlertTriangle className="h-4 w-4" />
         <AlertTitle>Erro no Admin</AlertTitle>
         <AlertDescription className="mt-2">
           <p className="mb-4">Ocorreu um erro ao carregar esta seção do painel.</p>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => { router.invalidate(); reset(); }}>
               Tentar novamente
             </Button>
             <Button variant="outline" size="sm" asChild>
               <Link to="/admin">Ir para Dashboard</Link>
             </Button>
           </div>
         </AlertDescription>
       </Alert>
       {import.meta.env.DEV && (
         <pre className="mt-4 p-4 bg-red-50 text-red-800 rounded text-xs overflow-auto">
           {error.message}
         </pre>
       )}
     </div>
   );
 }

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
   errorComponent: AdminErrorComponent,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     let isMounted = true;
     const timeoutId = setTimeout(() => {
       if (isMounted && checking) {
         console.log("auth check timeout");
         setError("Tempo de resposta excedido. Verifique sua conexão.");
         setChecking(false);
       }
     }, 5000);
 
    const checkAuth = async () => {
       console.log("auth check started");
       try {
         const { data: { session }, error: sessionError } = await supabase.auth.getSession();
         
         if (sessionError) throw sessionError;
 
         if (!session) {
           console.log("auth check unauthenticated");
           if (isMounted) {
             console.log("redirecting to /admin/login");
             navigate({ to: "/admin/login" });
           }
           return;
         }
 
         const { data: role, error: roleError } = await supabase
           .from("user_roles")
           .select("role")
           .eq("user_id", session.user.id)
           .eq("role", "admin")
           .maybeSingle();
 
         if (roleError) throw roleError;
 
         if (!role) {
           console.log("auth check no admin role");
           await supabase.auth.signOut();
           if (isMounted) {
             console.log("redirecting to /admin/login");
             navigate({ to: "/admin/login" });
           }
           return;
         }
 
         console.log("auth check success");
         if (isMounted) {
           clearTimeout(timeoutId);
           setChecking(false);
         }
       } catch (err: any) {
         console.error("auth check error:", err);
         if (isMounted) {
           setError(err.message || "Erro ao validar permissões");
           setChecking(false);
         }
       }
    };

    checkAuth();
 
     return () => {
       isMounted = false;
       clearTimeout(timeoutId);
     };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

   if (checking) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="text-center">
           <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
           <p className="mt-2 text-sm text-gray-500">Verificando permissões...</p>
           <div className="mt-4">
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => {
                 console.log("Manual redirect to login clicked");
                 navigate({ to: "/admin/login" });
               }}
             >
               Ir para Login
             </Button>
           </div>
         </div>
       </div>
     );
   }
 
   if (error) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="max-w-md w-full">
           <Alert variant="destructive">
             <AlertTriangle className="h-4 w-4" />
             <AlertTitle>Falha na Autenticação</AlertTitle>
             <AlertDescription className="mt-2">
               <p className="mb-4">{error}</p>
               <Button 
                 className="w-full"
                 onClick={() => {
                   console.log("Error state redirect to login clicked");
                   navigate({ to: "/admin/login" });
                 }}
               >
                 Voltar para Login
               </Button>
             </AlertDescription>
           </Alert>
         </div>
       </div>
     );
   }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Checkout Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors [&.active]:bg-black [&.active]:text-white"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link 
            to="/admin/projects" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors [&.active]:bg-black [&.active]:text-white"
          >
            <Briefcase size={20} />
            <span className="font-medium">Projetos</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Painel de Controle</h2>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
