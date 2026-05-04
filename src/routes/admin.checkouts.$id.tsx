import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, ShieldCheck, Info } from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PIX_REQUIRED_FIELDS = [
  { key: "customer_name", label: "Nome Completo", type: "text", equivalents: ["name", "nome", "full_name", "customer_name"] },
  { key: "customer_email", label: "E-mail", type: "email", equivalents: ["email", "e-mail", "email_address", "customer_email"] },
  { key: "customer_phone", label: "WhatsApp / Telefone", type: "tel", equivalents: ["phone", "telefone", "whatsapp", "customer_phone"] },
  { key: "customer_cpf", label: "CPF", type: "text", equivalents: ["cpf", "document", "documento", "customer_cpf"] },
  { key: "instagram", label: "Instagram", type: "text", equivalents: ["instagram", "ig", "insta"] },
  { key: "observacao", label: "Observação", type: "text", equivalents: ["observacao", "notes", "obs"] },
];

export const Route = createFileRoute("/admin/checkouts/$id")({
  component: CheckoutEditPage,
});

function CheckoutEditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  
  const [loading, setLoading] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [checkout, setCheckout] = useState<any>({
    title: "",
    subtitle: "",
    slug: "",
    price: 0,
    cta_text: "Liberar acesso agora",
    media_asset: null,
    active: true,
    template_key: "base",
    layout_config: {},
  });
  const [fields, setFields] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const normalizeFields = useCallback((existingFields: any[]) => {
    const normalized = existingFields.map(f => {
      const isActive = !f.field_type?.startsWith("hidden:");
      const baseInfo = PIX_REQUIRED_FIELDS.find(req => 
        f.field_name === req.key || req.equivalents.includes(f.field_name)
      );

      return {
        ...f,
        field_name: baseInfo ? baseInfo.key : f.field_name,
        active: isActive,
        field_type: f.field_type?.replace("hidden:", "") || "text",
        system_field: !!baseInfo
      };
    });
    
    PIX_REQUIRED_FIELDS.forEach(req => {
      const exists = normalized.some(f => f.field_name === req.key);
      if (!exists) {
        normalized.push({
          field_name: req.key,
          field_label: req.label,
          field_type: req.type,
          required: false,
          active: false, 
          system_field: true,
          sort_order: normalized.length + 1
        });
      }
    });

    return normalized.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, []);

  useEffect(() => {
    fetchProjects();
    if (!isNew) {
      fetchCheckout();
    } else {
      setCheckout({
        title: "",
        subtitle: "",
        slug: "",
        price: 0,
        cta_text: "Liberar acesso agora",
        media_asset: null,
        active: true,
        template_key: "base",
        layout_config: {},
      });
      setFields(normalizeFields([]));
    }
  }, [id, normalizeFields]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("checkout_projects")
      .select("id, name, slug");
    if (!error && data) {
      setProjects(data);
    }
  };

  const fetchCheckout = async () => {
    const { data, error } = await supabase
      .from("checkouts")
      .select("*, checkout_fields(*)")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Erro ao carregar checkout: " + error.message);
      navigate({ to: "/admin/checkouts" });
      return;
    }

    setCheckout({
      ...data,
      media_asset:
        (data.media_json as any) ||
        (data.media_url
          ? { url: data.media_url, type: data.media_type || "image", source: "external_url" }
          : null),
    });
    
    const existingFields = data.checkout_fields || [];
    setFields(normalizeFields(existingFields));
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
        status: checkout.active ? 'published' : 'draft',
        media_json: checkout.media_asset ?? null,
        media_url: checkout.media_asset?.url ?? null,
        media_type: checkout.media_asset?.type ?? null,
        design_key: checkout.design_key ?? "default_v1",
        updated_at: new Date().toISOString(),
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

      const fieldsToInsert = fields
        .filter((f) => f.field_label)
        .map((f, index) => ({
          field_name: f.field_name || `field_${index}`,
          field_label: f.field_label,
          field_type: f.active ? (f.field_type || "text") : `hidden:${f.field_type || "text"}`,
          required: !!f.required,
          checkout_id: checkoutId,
          sort_order: index + 1,
        } as any));

      if (fieldsToInsert.length > 0) {
        const { error: fError } = await supabase
          .from("checkout_fields")
          .insert(fieldsToInsert);
        if (fError) throw fError;
      }

      toast.success("Checkout salvo com sucesso!");
      navigate({ to: "/admin/checkouts" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar checkout");
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    setFields([...fields, { field_name: "", field_label: "", field_type: "text", required: false, active: true, sort_order: fields.length + 1 }]);
  };

  const removeField = (index: number) => {
    const field = fields[index];
    if (field.system_field) {
      toast.error("Campos base do sistema não podem ser excluídos, apenas desativados.");
      return;
    }
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields];
    if (key === "field_name" && newFields[index].system_field) return;
    newFields[index][key] = value;
    setFields(newFields);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/checkouts" })}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? "Novo Checkout" : "Editar Checkout"}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Informações Básicas</h2>
            
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={checkout.title} 
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
                  value={checkout.slug} 
                  onChange={(e) => setCheckout({ ...checkout, slug: e.target.value })}
                  placeholder="acesso-reservado"
                />
              </div>
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={checkout.price} 
                  onChange={(e) => setCheckout({ ...checkout, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Texto do Botão (CTA)</Label>
              <Input 
                value={checkout.cta_text} 
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
              value={checkout.media_asset} 
              onChange={(val) => setCheckout({ ...checkout, media_asset: val })}
              onUploading={setIsUploadingMedia}
              pathPrefix={checkout.slug || "temp"}
            />
          </Card>

          <Card className="p-6 space-y-4 mb-6">
            <h2 className="text-xl font-semibold border-b pb-2">Design do Checkout</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Escolha o Design</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={checkout.design_key || "default_v1"} 
                  onChange={(e) => setCheckout({ 
                    ...checkout, 
                    design_key: e.target.value 
                  })}
                >
                  <option value="default_v1">Padrão Dark (Premium)</option>
                  <option value="receitas_v1">Receitas Práticas (Editorial)</option>
                  <option value="comunidade_v1">Comunidade Premium</option>
                  <option value="visagismo_v1">Visagismo & IA</option>
                  <option value="reservado_v1">Acesso Reservado</option>
                </select>
                <p className="text-[10px] text-muted-foreground italic">
                  O design selecionado define a identidade visual do checkout público.
                </p>
              </div>
            </div>
          </Card>

                      }}
                    />
                    <Input 
                      placeholder="Texto"
                      value={checkout.layout_config?.benefits?.[i]?.text || ""} 
                      onChange={(e) => {
                        const newBenefits = [...(checkout.layout_config?.benefits || [{}, {}, {}])];
                        newBenefits[i] = { ...newBenefits[i], text: e.target.value };
                        setCheckout({ ...checkout, layout_config: { ...checkout.layout_config, benefits: newBenefits } });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Campos do Formulário</h2>
              <Button size="sm" variant="outline" onClick={addField}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            <div className="space-y-4">
              <TooltipProvider>
                {fields.map((field, index) => (
                  <div key={index} className={`p-4 border rounded-lg space-y-3 relative group ${!field.active ? 'opacity-50 grayscale' : field.system_field ? 'bg-blue-500/5 border-blue-500/20' : 'bg-muted/30'}`}>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                        <Input 
                          value={field.field_label}
                          onChange={(e) => updateField(index, "field_label", e.target.value)}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Name (DB)</Label>
                        <Input 
                          value={field.field_name}
                          disabled={field.system_field}
                          onChange={(e) => updateField(index, "field_name", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={field.active !== false}
                            onCheckedChange={(val) => updateField(index, "active", val)}
                          />
                          <span className="text-xs">Ativo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={field.required}
                            disabled={field.active === false}
                            onCheckedChange={(val) => updateField(index, "required", val)}
                          />
                          <span className="text-xs">Obrigatório</span>
                        </div>
                      </div>
                      {!field.system_field && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive h-8 w-8"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-4 pb-10">
        <Button variant="outline" onClick={() => navigate({ to: "/admin/checkouts" })}>Cancelar</Button>
        <Button onClick={handleSave} disabled={loading || isUploadingMedia}>
          {loading ? "Salvando..." : "Salvar Checkout"}
        </Button>
      </div>
    </div>
  );
}
