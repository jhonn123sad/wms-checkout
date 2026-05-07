import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/checkouts/$id")({
  component: CheckoutEditPage,
});

function CheckoutEditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState<any>({
    title: "",
    subtitle: "",
    slug: "",
    price: 0,
    cta_text: "Liberar acesso agora",
    media_url: "",
    media_type: "image",
    active: true,
  });
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    if (!isNew) {
      fetchCheckout();
    } else {
      setFields([
        { field_name: "nome", field_label: "Nome Completo", field_type: "text", required: true, sort_order: 1 },
        { field_name: "email", field_label: "E-mail", field_type: "email", required: true, sort_order: 2 },
      ]);
    }
  }, [id]);

  const fetchCheckout = async () => {
    const { data, error } = await supabase
      .from("checkouts")
      .select("*, checkout_fields(*)")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Erro ao carregar checkout");
      navigate({ to: "/admin/checkouts" });
      return;
    }

    setCheckout(data);
    setFields((data.checkout_fields || []).sort((a: any, b: any) => a.sort_order - b.sort_order));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let checkoutId = id;
      
      const checkoutPayload: any = {
        title: checkout.title,
        subtitle: checkout.subtitle,
        slug: checkout.slug,
        price: checkout.price,
        cta_text: checkout.cta_text,
        active: checkout.active,
        media_url: checkout.media_url,
        media_type: checkout.media_type,
        updated_at: new Date().toISOString()
      };

      if (isNew) {
        const { data, error } = await supabase
          .from("checkouts")
          .insert([checkoutPayload])
          .select()
          .single();
        if (error) throw error;
        checkoutId = data.id;
      } else {
        const { error } = await supabase
          .from("checkouts")
          .update(checkoutPayload)
          .eq("id", id);
        if (error) throw error;
      }

      if (!isNew) {
        await supabase.from("checkout_fields").delete().eq("checkout_id", checkoutId);
      }
      
      const fieldsToInsert = fields.map((f, index) => ({
        field_name: f.field_name,
        field_label: f.field_label,
        field_type: f.field_type || "text",
        required: f.required,
        checkout_id: checkoutId,
        sort_order: index + 1,
      }));

      if (fieldsToInsert.length > 0) {
        const { error: fError } = await supabase.from("checkout_fields").insert(fieldsToInsert);
        if (fError) throw fError;
      }

      toast.success("Checkout salvo com sucesso!");
      navigate({ to: "/admin/checkouts" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    setFields([...fields, { field_name: "", field_label: "", field_type: "text", required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/checkouts" })}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? "Novo Checkout" : "Editar Checkout"}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Informações Básicas</h2>
            
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={checkout.title || ""} 
                onChange={(e) => setCheckout({ ...checkout, title: e.target.value })}
                placeholder="Ex: Acesso Reservado"
              />
            </div>

            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={checkout.subtitle || ""} 
                onChange={(e) => setCheckout({ ...checkout, subtitle: e.target.value })}
                placeholder="Ex: Conteúdo exclusivo liberado após confirmação"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slug da URL</Label>
                <Input 
                  value={checkout.slug || ""} 
                  onChange={(e) => setCheckout({ ...checkout, slug: e.target.value })}
                  placeholder="acesso-reservado"
                />
              </div>
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={checkout.price || 0} 
                  onChange={(e) => setCheckout({ ...checkout, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Texto do Botão (CTA)</Label>
              <Input 
                value={checkout.cta_text || ""} 
                onChange={(e) => setCheckout({ ...checkout, cta_text: e.target.value })}
                placeholder="Liberar acesso agora"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label>Status Ativo</Label>
              <Switch 
                checked={checkout.active} 
                onCheckedChange={(checked) => setCheckout({ ...checkout, active: checked })}
              />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Mídia do Checkout</h2>
            <MediaField 
              value={checkout.media_url ? { url: checkout.media_url, type: checkout.media_type, provider: 'external' } : null} 
              onChange={(val) => setCheckout({ ...checkout, media_url: val?.url || "", media_type: val?.type || "image" })} 
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Campos do Formulário</h2>
              <Button size="sm" variant="outline" onClick={addField}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/30 space-y-3 relative group">
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                      <Input 
                        placeholder="Ex: Nome Completo" 
                        value={field.field_label}
                        onChange={(e) => updateField(index, "field_label", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Name (DB)</Label>
                      <Input 
                        placeholder="Ex: nome" 
                        value={field.field_name}
                        onChange={(e) => updateField(index, "field_name", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={field.required}
                        onCheckedChange={(val) => updateField(index, "required", val)}
                      />
                      <span className="text-xs">Obrigatório</span>
                    </div>
                    
                    <Button variant="ghost" size="icon" onClick={() => removeField(index)} className="text-destructive h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Button 
            className="w-full py-6 text-lg font-bold" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
