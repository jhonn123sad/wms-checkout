 import { createFileRoute, Link } from "@tanstack/react-router";
 import { supabase } from "@/integrations/supabase/client";
 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { Plus, Edit, ExternalLink, Users } from "lucide-react";
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
 
     if (!error) {
       setCheckouts(data);
     }
     setLoading(false);
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
               <div className="h-32 bg-muted relative">
                 {checkout.media_type === "image" ? (
                   <img 
                     src={checkout.media_url} 
                     alt={checkout.title} 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-black">
                     <span className="text-xs text-white">Video Preview</span>
                   </div>
                 )}
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
                   <p className="text-xs text-muted-foreground mb-2">/{checkout.slug}</p>
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
                        href={`/checkout/${checkout.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent text-muted-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link 
                        to="/admin/checkouts/$id" 
                        params={{ id: checkout.id }}
                        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent text-muted-foreground transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
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