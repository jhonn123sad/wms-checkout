import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    pages: 0,
    checkouts: 0,
    leads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [pagesRes, checkoutsRes, leadsRes] = await Promise.all([
        supabase.from("pages").select("id", { count: "exact", head: true }),
        supabase.from("checkouts").select("id", { count: "exact", head: true }),
        supabase.from("checkout_leads").select("id", { count: "exact", head: true })
      ]);

      setStats({
        pages: pagesRes.count || 0,
        checkouts: checkoutsRes.count || 0,
        leads: leadsRes.count || 0
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "Páginas", value: stats.pages, icon: FileText, color: "text-blue-500", href: "/admin/pages/" },
    { title: "Checkouts", value: stats.checkouts, icon: ShoppingCart, color: "text-purple-500", href: "/admin/checkouts/" },
    { title: "Leads Totais", value: stats.leads, icon: Users, color: "text-green-500", href: "/admin/checkouts/" },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Bem-vindo ao Painel</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema de checkouts e páginas.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.title} to={card.href as any}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">Gerenciar {card.title.toLowerCase()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link to="/admin/pages/$id" params={{ id: "new" }}>
              <Button className="w-full justify-start gap-2" variant="outline">
                <FileText className="w-4 h-4" /> Criar Nova Página
              </Button>
            </Link>
            <Link to="/admin/checkouts/$id" params={{ id: "new" }}>
              <Button className="w-full justify-start gap-2" variant="outline">
                <ShoppingCart className="w-4 h-4" /> Criar Novo Checkout
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ferramentas de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <h3 className="text-sm font-semibold">Simular Pagamento Aprovado</h3>
              <p className="text-xs text-muted-foreground">Último pedido gerado no sistema será marcado como pago.</p>
              <Button 
                size="sm" 
                className="w-full gap-2" 
                variant="secondary"
                onClick={async () => {
                  const { data: lastOrder, error: orderError } = await supabase
                    .from("orders")
                    .select("id, status")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                  if (orderError || !lastOrder) {
                    return toast.error("Nenhum pedido encontrado.");
                  }

                  if (lastOrder.status === 'paid') {
                    return toast.error("O pedido mais recente já está pago.");
                  }

                  const { error: updateError } = await supabase
                    .from("orders")
                    .update({ 
                      status: 'paid',
                      paid_at: new Date().toISOString()
                    })
                    .eq("id", lastOrder.id);

                  if (updateError) {
                    toast.error("Erro ao aprovar pedido: " + updateError.message);
                  } else {
                    toast.success("Pedido aprovado com sucesso! (ID: " + lastOrder.id.slice(0,8) + ")");
                  }
                }}
              >
                <TrendingUp className="w-4 h-4" /> Aprovar Último Pedido
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Banco de Dados (Supabase)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage (Arquivos)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium">Online</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
