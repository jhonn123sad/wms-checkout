 import { createFileRoute, Link } from "@tanstack/react-router";
 import { supabase } from "@/integrations/supabase/client";
 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
import { Plus, Edit, ExternalLink, Users, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
 import { Badge } from "@/components/ui/badge";
 
 export const Route = createFileRoute("/admin/checkouts/")({
   component: AdminCheckoutsList,
 });
 
 function AdminCheckoutsList() {
   const [checkouts, setCheckouts] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     fetchCheckouts();
   }, []);
 
  const fetchCheckouts = async () => {
    const { data, error } = await supabase
      .from("checkouts")
      .select("*, checkout_leads(count)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar checkouts");
    } else {
      setCheckouts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este checkout?")) return;
    const { error } = await supabase.from("checkouts").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir checkout");
    } else {
      toast.success("Checkout excluído");
      fetchCheckouts();
    }
  };

  const handleDuplicate = async (checkout: any) => {
    const { id, created_at, updated_at, checkout_leads, ...checkoutData } = checkout;
    const newCheckout = {
      ...checkoutData,
      title: `${checkout.title} (Cópia)`,
      slug: `${checkout.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: "draft",
      design_key: checkout.design_key || "default_v1",
      success_redirect_url: checkout.success_redirect_url || null,
    };

    const { data, error } = await supabase.from("checkouts").insert(newCheckout).select().single();
    
    if (error) {
      toast.error("Erro ao duplicar checkout: " + error.message);
    } else {
      // Duplicar campos também
      const { data: fields } = await supabase.from("checkout_fields").select("*").eq("checkout_id", id);
      if (fields && fields.length > 0) {
        const newFields = fields.map(({ id: fId, checkout_id, ...fData }) => ({
          ...fData,
          checkout_id: data.id
        }));
        await supabase.from("checkout_fields").insert(newFields);
      }
      
      toast.success("Checkout duplicado");
      fetchCheckouts();
    }
  };
 
   return (
     <div className="p-8 max-w-7xl mx-auto space-y-8">
       <div className="flex justify-between items-center">
         <div>
           <h1 className="text-3xl font-bold">Checkouts MVP</h1>
           <p className="text-muted-foreground">Gerencie seus checkouts personalizados</p>
         </div>
          <Link 
            to="/admin/checkouts/$id" 
            params={{ id: "new" }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Checkout
          </Link>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
           Array.from({ length: 3 }).map((_, i) => (
             <Card key={i} className="h-48 animate-pulse bg-muted" />
           ))
         ) : checkouts.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-muted/30 rounded-xl border-2 border-dashed">
             <p className="text-muted-foreground">Nenhum checkout cadastrado ainda.</p>
           </div>
         ) : (
           checkouts.map((checkout) => (
             <Card key={checkout.id} className="overflow-hidden border-border flex flex-col">
                <div className="h-32 bg-muted relative overflow-hidden">
                  {(() => {
                    const media = checkout.media_json || (checkout.media_url ? { url: checkout.media_url, type: checkout.media_type, source: 'external' } : null);
                    const type = checkout.media_type || media?.type;
                    const url = checkout.media_url || media?.url;

                    if (type === "image" || type === "gif") {
                      return (
                        <img 
                          src={url} 
                          alt={checkout.title} 
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    if (type === "video" || type === "youtube") {
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black gap-1">
                          <span className="text-[10px] text-white uppercase font-bold tracking-widest">{type}</span>
                          <span className="text-[8px] text-white/50 truncate max-w-[90%] px-2">{url}</span>
                        </div>
                      );
                    }
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">Sem Mídia</span>
                      </div>
                    );
                  })()}
                 <div className="absolute top-2 right-2">
                   <Badge variant={checkout.active ? "default" : "secondary"}>
                     {checkout.active ? "Ativo" : "Inativo"}
                   </Badge>
                 </div>
               </div>
               <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                 <div>
                   <h3 className="font-bold text-lg leading-tight mb-1 truncate">
                     {checkout.title}
                   </h3>
                   <p className="text-xs text-muted-foreground mb-2">/c/{checkout.slug}</p>
                   <div className="flex items-center text-sm font-medium text-green-600">
                     R$ {checkout.price.toFixed(2)}
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between pt-2 border-t text-sm">
                   <div className="flex items-center text-muted-foreground">
                     <Users className="w-4 h-4 mr-1" />
                     {checkout.checkout_leads?.[0]?.count || 0} leads
                   </div>
                    <div className="flex gap-2 items-center">
                      <a 
                        href={`/c/${checkout.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-accent text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Abrir Checkout Real
                      </a>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(checkout)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Link 
                        to="/admin/checkouts/$id" 
                        params={{ id: checkout.id }}
                        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent text-muted-foreground transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(checkout.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                 </div>
               </div>
             </Card>
           ))
         )}
       </div>
     </div>
   );
 }