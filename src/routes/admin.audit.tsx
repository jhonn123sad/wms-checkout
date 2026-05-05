import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, RefreshCcw, ExternalLink, Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/audit")({
  component: AuditPage,
});

function AuditPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const { data: auditData, error } = await (supabase.rpc as any)("get_global_checkout_audit");
      if (error) throw error;
      setData(auditData || []);
    } catch (err: any) {
      console.error("Error fetching audit:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            Auditoria Global de Checkouts
          </h1>
          <p className="text-muted-foreground">Visão geral da integridade de todos os checkouts ativos</p>
        </div>
        <Button onClick={fetchAuditData} disabled={loading} variant="outline" className="gap-2">
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b uppercase text-[10px] font-bold text-muted-foreground">
              <tr>
                <th className="p-4">Checkout / Slug</th>
                <th className="p-4">Preço (Checkout)</th>
                <th className="p-4">Preço (Última Order)</th>
                <th className="p-4">Sincronização</th>
                <th className="p-4">Status Preço</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="p-8 bg-muted/10"></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground italic">
                    Nenhum checkout encontrado.
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const priceMatch = item.order_price_match;
                  const hasOrder = !!item.last_order_id;
                  const urlOk = !!item.checkout_url_filled;

                  return (
                    <tr key={item.checkout_id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold">{item.title}</div>
                        <div className="text-xs text-muted-foreground font-mono">/c/{item.slug}</div>
                      </td>
                      <td className="p-4 font-medium">
                        R$ {item.checkout_price?.toFixed(2)}
                      </td>
                      <td className="p-4">
                        {hasOrder ? (
                          <div className="flex flex-col">
                            <span className="font-mono">R$ {(item.last_order_price / 100).toFixed(2)}</span>
                            <span className="text-[10px] opacity-60">ID: {item.last_order_id.substring(0,8)}...</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">Sem orders</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Badge variant={urlOk ? "outline" : "destructive"} className={urlOk ? "text-green-500 border-green-500/20" : ""}>
                            URL: {urlOk ? "OK" : "ERRO"}
                          </Badge>
                          <Badge variant={item.order_has_checkout_id ? "outline" : "destructive"} className={item.order_has_checkout_id ? "text-green-500 border-green-500/20" : ""}>
                            Sync: {item.order_has_checkout_id ? "OK" : "ERRO"}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        {!hasOrder ? (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-500/20 bg-yellow-500/5 gap-1">
                            <AlertTriangle className="w-3 h-3" /> Aguardando Order
                          </Badge>
                        ) : priceMatch ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Preço OK
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/5 gap-1">
                            <XCircle className="w-3 h-3" /> Preço Diferente
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/checkouts/${item.checkout_id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <a href={`/c/${item.slug}`} target="_blank" rel="noreferrer">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);
