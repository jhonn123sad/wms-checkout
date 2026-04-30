 import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
   const [authReady, setAuthReady] = useState(true);
  const navigate = useNavigate();
 
   useEffect(() => {
     // Basic check if supabase is responsive
     supabase.auth.getSession().catch(() => {
       setAuthReady(false);
     });
   }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check for admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) {
        await supabase.auth.signOut();
        toast.error("Acesso negado. Você não tem permissão de administrador.");
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate({ to: "/admin" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para gerenciar os checkouts
          </CardDescription>
        </CardHeader>
        <CardContent>
           {!authReady && (
             <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
               Autenticação admin ainda não configurada ou instável. 
               Verifique sua conexão com o Supabase.
             </div>
           )}
           <form onSubmit={handleLogin} className="space-y-4 opacity-100">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
