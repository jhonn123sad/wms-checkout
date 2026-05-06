import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ArrowLeft, Plus, Trash2, ShieldCheck, Info, 
  CheckCircle2, AlertTriangle, XCircle, Copy, Play, 
  RefreshCcw, Search, Eye
} from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    design_key: "default_v1",
    success_redirect_url: "",
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
        design_key: "default_v1",
        success_redirect_url: "",
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
    console.log("[Admin Save] fetchCheckout iniciado para ID:", id);
    const { data, error } = await supabase
      .from("checkouts")
      .select("*, checkout_fields(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[Admin Save] erro ao buscar checkout:", error);
      toast.error("Erro ao carregar checkout: " + error.message);
      navigate({ to: "/admin/checkouts" });
      return;
    }

    console.log("[Admin Save] checkout carregado do banco:", data);

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
    console.log("[Admin Save] campos normalizados e definidos no estado");
  };

  const handleSave = async () => {
    console.log("[Admin Save] clique no botão salvar");
    setLoading(true);
    try {
      let checkoutId = id;

      const checkoutPayload: any = {
        title: checkout.title,
        subtitle: checkout.subtitle,
        slug: checkout.slug,
        price: isNaN(parseFloat(checkout.price)) ? 0 : parseFloat(checkout.price),
        cta_text: checkout.cta_text,
        active: checkout.active,
        status: checkout.active ? 'published' : 'draft',
        media_json: checkout.media_asset ?? null,
        media_url: checkout.media_asset?.url ?? null,
        media_type: checkout.media_asset?.type ?? null,
        design_key: checkout.design_key || "default_v1",
        success_redirect_url: checkout.success_redirect_url || null,
        updated_at: new Date().toISOString(),
      };

      console.log("[Admin Save] payload", checkoutPayload);

      let data, error;
      if (isNew) {
        const result = await supabase
          .from("checkouts")
          .insert([checkoutPayload])
          .select()
          .maybeSingle();
        data = result.data;
        error = result.error;
        
        if (!error && data) {
          checkoutId = data.id;
        }
      } else {
        const result = await supabase
          .from("checkouts")
          .update(checkoutPayload)
          .eq("id", id)
          .select()
          .maybeSingle();
        data = result.data;
        error = result.error;
      }

      console.log("[Admin Save] resultado", data);

      if (error) {
        console.error("[Admin Save] erro", error);
        toast.error(`Erro ao salvar: ${error.message}`);
        setLoading(false);
        return;
      }

      if (!checkoutId) {
        throw new Error("ID do checkout não retornado");
      }

      // Re-sincronizar campos
      if (!isNew) {
        await supabase
          .from("checkout_fields")
          .delete()
          .eq("checkout_id", checkoutId);
      }

      const fieldsToInsert = fields
        .filter((f) => f.field_label)
        .map((f, index) => ({
          checkout_id: checkoutId,
          field_name: f.field_name,
          field_label: f.field_label,
          field_type: f.active ? (f.field_type || "text") : `hidden:${f.field_type || "text"}`,
          required: !!f.required,
          sort_order: index + 1,
        }));

      console.log("[Admin Save] campos", fieldsToInsert);

      if (fieldsToInsert.length > 0) {
        const { error: fError } = await supabase
          .from("checkout_fields")
          .insert(fieldsToInsert);
        
        if (fError) {
          console.error("[Admin Save] erro campos", fError);
          toast.error(`Checkout salvo, mas erro nos campos: ${fError.message}`);
        }
      }

      toast.success("Checkout salvo com sucesso!");
      
      if (isNew) {
        navigate({ to: "/admin/checkouts" });
      } else {
        await fetchCheckout();
      }
    } catch (error: any) {
      console.error("[Admin Save] erro fatal", error);
      toast.error(error.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleTestLink = () => {
    const url = checkout.success_redirect_url;
    if (!url || !url.trim()) {
      toast.error("Nenhuma URL de entrega configurada.");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast.error("Informe uma URL válida começando com https://");
      return;
    }

    toast.success("Abrindo link de entrega em nova aba...");
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("O navegador bloqueou a nova aba. Tente clicar no link manual abaixo.");
    }
  };

  
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [validatorData, setValidatorData] = useState<any>(null);
  const [validatorLoading, setValidatorLoading] = useState(false);
  const [debugResponse, setDebugResponse] = useState<any>(null);

  const fetchValidatorData = async () => {
    if (isNew || !checkout.slug) {
      toast.error("Salve o checkout antes de validar.");
      return;
    }
    
    setValidatorLoading(true);
    setDebugResponse(null);
    try {
      console.log("[Validator] Calling RPC validate_checkout_delivery_report for slug:", checkout.slug);
      const { data, error } = await (supabase.rpc as any)("validate_checkout_delivery_report", {
        p_slug: checkout.slug
      });

      if (error) throw error;
      
      console.log("[Validator] RPC Result:", data);
      setValidatorData(data);
      setIsValidatorOpen(true);
    } catch (err: any) {
      console.error("Error fetching validator data:", err);
      toast.error("Erro ao carregar dados de validação: " + err.message);
    } finally {
      setValidatorLoading(false);
    }
  };

  const verifyLastOrderRedirect = () => {
    fetchValidatorData();
  };


  const testGetOrderStatus = async (orderId: string, token: string) => {
    setDebugResponse(null);
    try {
      const { data, error } = await supabase.functions.invoke("get-order-status", {
        body: { orderId, token }
      });
      if (error) throw error;
      setDebugResponse(data);
      toast.success("Endpoint get-order-status testado!");
    } catch (err: any) {
      toast.error("Erro no teste: " + err.message);
      setDebugResponse({ error: err.message });
    }
  };

  const copyTestConsole = (orderId: string, token: string) => {
    const code = `fetch("https://rqassaxkbntpcwhvevyi.supabase.co/functions/v1/get-order-status", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    orderId: "${orderId}",
    token: "${token}"
  })
})
  .then(r => r.json())
  .then(console.log);`;
    
    navigator.clipboard.writeText(code);
    toast.success("Código copiado para o console!");
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/checkouts" })}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">{isNew ? "Novo Checkout" : "Editar Checkout"}</h1>
        </div>
        {!isNew && (
          <Button 
            variant="outline" 
            className="gap-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            onClick={() => {
              setIsValidatorOpen(true);
              fetchValidatorData();
            }}
          >
            <ShieldCheck className="w-4 h-4" />
            Validar entrega do checkout
          </Button>
        )}
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
                  <option value="apple_v1">Premium Style (Apple)</option>
                </select>
                <p className="text-[10px] text-muted-foreground italic">
                  O design selecionado define a identidade visual do checkout público.
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 space-y-4 mb-6">
            <h2 className="text-xl font-semibold border-b pb-2">Entrega após pagamento</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URL de Sucesso (Redirecionamento Externo)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={checkout.success_redirect_url || ""} 
                    onChange={(e) => setCheckout({ ...checkout, success_redirect_url: e.target.value })}
                    placeholder="https://sua-entrega.com/obrigado"
                  />
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={handleTestLink}
                    disabled={!checkout.success_redirect_url}
                  >
                    Testar link
                  </Button>
                </div>
                {checkout.success_redirect_url && (
                  <a 
                    href={checkout.success_redirect_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-green-500 hover:underline flex items-center gap-1 mt-1"
                  >
                    Clique aqui se o popup for bloqueado: {checkout.success_redirect_url}
                  </a>
                )}
                <p className="text-[10px] text-muted-foreground italic mt-2">
                  Após pagamento confirmado, o comprador será enviado para este link.
                </p>
              </div>

              {!isNew && (
                <div className="pt-2 border-t mt-2">
                  <Button 
                    variant="secondary" 
                    className="w-full text-xs"
                    onClick={verifyLastOrderRedirect}
                    disabled={validatorLoading}
                  >
                    {validatorLoading ? "Gerando relatório..." : "Verificar Fluxo de Entrega (Última Order)"}
                  </Button>
                </div>
              )}
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
    {/* Validador de Entrega Modal */}
      <Dialog open={isValidatorOpen} onOpenChange={setIsValidatorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              Validador de Entrega do Checkout
            </DialogTitle>
            <DialogDescription>
              Verifique a integridade do fluxo de entrega pós-pagamento.
            </DialogDescription>
          </DialogHeader>

          {validatorLoading ? (
            <div className="p-12 flex justify-center items-center">
              <RefreshCcw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : validatorData ? (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Dados do Checkout */}
                <Card className="p-4 space-y-3">
                  <h3 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                    <Info className="w-4 h-4" /> 1. Checkout
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{validatorData.checkout?.checkout_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slug:</span>
                      <span>{validatorData.checkout?.slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preço:</span>
                      <span>R$ {validatorData.checkout?.price?.toFixed(2)} ({validatorData.checkout?.price_cents} cents)</span>
                    </div>
                    <div className="pt-1">
                      <p className="text-muted-foreground mb-1">Success Redirect URL:</p>
                      <p className="font-mono text-[10px] break-all bg-muted/50 p-1 rounded">
                        {validatorData.checkout?.success_redirect_url || "N/A"}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* 2. Produto */}
                <Card className="p-4 space-y-3">
                  <h3 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                    <Search className="w-4 h-4" /> 2. Produto Legado
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{validatorData.product?.product_id || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preço:</span>
                      <span>{validatorData.product?.price_cents ? `${validatorData.product.price_cents} cents` : "N/A"}</span>
                    </div>
                    <div className="pt-1">
                      <p className="text-muted-foreground mb-1">Thank You URL:</p>
                      <p className="font-mono text-[10px] break-all bg-muted/50 p-1 rounded">
                        {validatorData.product?.thank_you_url || "N/A"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 3. Checklist */}
              <Card className="p-4 space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                  <ShieldCheck className="w-4 h-4" /> 3. Checklist de Sincronização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  {[
                    { label: "URL do checkout preenchida", value: validatorData.checks?.checkout_url_filled },
                    { label: "Produto mapeado", value: validatorData.checks?.has_product_map },
                    { label: "URLs iguais", value: validatorData.checks?.urls_equal },
                    { label: "Preço checkout válido", value: validatorData.checks?.checkout_price_valid },
                    { label: "Preço produto sincronizado", value: validatorData.checks?.product_price_synced },
                    { label: "Existe última order", value: validatorData.checks?.has_latest_order },
                    { label: "Última order tem checkout_id", value: validatorData.checks?.latest_order_has_checkout_id },
                    { label: "Preço da order confere", value: validatorData.checks?.latest_order_price_matches_checkout },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1 border-b border-dashed last:border-0">
                      <span className="text-muted-foreground">{item.label}</span>
                      {item.value === true ? (
                        <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Sim
                        </Badge>
                      ) : item.value === false ? (
                        <Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/5">
                          <XCircle className="w-3 h-3 mr-1" /> Não
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500/20 bg-yellow-500/5">
                          <AlertTriangle className="w-3 h-3 mr-1" /> N/A
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* 4. Última Order */}
              {validatorData.latest_order && (
                <Card className="p-4 space-y-3 border-blue-500/20 bg-blue-500/5">
                  <h3 className="font-bold flex items-center gap-2 text-sm border-b border-blue-500/10 pb-2">
                    <Play className="w-4 h-4 text-blue-500" /> 4. Última Order
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono">{validatorData.latest_order.order_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={validatorData.latest_order.status === 'paid' ? 'default' : 'secondary'} className={validatorData.latest_order.status === 'paid' ? 'bg-green-500 h-4 text-[9px]' : 'h-4 text-[9px]'}>
                          {validatorData.latest_order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Cents:</span>
                        <span>{validatorData.latest_order.amount_cents}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Checkout ID:</span>
                        <Badge variant={validatorData.latest_order.checkout_id ? "outline" : "destructive"} className="h-4 text-[9px]">
                          {validatorData.latest_order.checkout_id || "NULL"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Token:</span>
                        <span className="font-mono opacity-60">{validatorData.latest_order.public_access_token?.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] flex-1" onClick={() => testGetOrderStatus(validatorData.latest_order.order_id, validatorData.latest_order.public_access_token)}>
                      <Eye className="w-3 h-3 mr-1" /> Testar get-order-status
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] flex-1" onClick={() => copyTestConsole(validatorData.latest_order.order_id, validatorData.latest_order.public_access_token)}>
                      <Copy className="w-3 h-3 mr-1" /> Copiar Console Code
                    </Button>
                  </div>
                </Card>
              )}

              {/* 5. Últimas 5 Orders */}
              <Card className="p-4 space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                  <Search className="w-4 h-4" /> 5. Últimas 5 Orders
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-muted/50 uppercase text-muted-foreground">
                      <tr>
                        <th className="p-2">ID / Criado em</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Preço (cents)</th>
                        <th className="p-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(validatorData.orders || []).map((order: any) => (
                        <tr key={order.order_id} className="hover:bg-muted/30">
                          <td className="p-2">
                            <div className="font-mono text-[9px]">{order.order_id}</div>
                            <div className="opacity-60">{format(new Date(order.created_at), 'dd/MM/yy HH:mm', { locale: ptBR })}</div>
                          </td>
                          <td className="p-2">
                            <Badge variant={order.status === 'paid' ? 'default' : 'secondary'} className={order.status === 'paid' ? 'bg-green-500 h-4 text-[9px]' : 'h-4 text-[9px]'}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="font-mono">{order.amount_cents}</div>
                            {order.checkout_id ? <Badge variant="outline" className="h-3 text-[7px] text-green-500">ID OK</Badge> : <Badge variant="outline" className="h-3 text-[7px] text-red-500">SEM ID</Badge>}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-6 w-6" title="Copiar teste console" onClick={() => copyTestConsole(order.order_id, order.public_access_token)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-blue-500" title="Testar get-order-status" onClick={() => testGetOrderStatus(order.order_id, order.public_access_token)}>
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </Card>

              {/* 6. Console Test Code */}
              {validatorData.console_test_code && (
                <Card className="p-4 bg-black/5 dark:bg-black/40 space-y-2">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Código de teste do console:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 gap-1 text-[10px]" 
                      onClick={() => {
                        navigator.clipboard.writeText(validatorData.console_test_code);
                        toast.success("Código de teste copiado!");
                      }}
                    >
                      <Copy className="w-3 h-3" /> Copiar código de teste do console
                    </Button>
                  </div>
                  <pre className="text-[9px] font-mono p-2 overflow-x-auto whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {validatorData.console_test_code}
                  </pre>
                </Card>
              )}

              {/* Debug Response Area */}
              {debugResponse && (
                <Card className="p-4 bg-black/5 dark:bg-black/40 space-y-2">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Retorno get-order-status:</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => setDebugResponse(null)}>
                      <XCircle className="w-3 h-3" />
                    </Button>
                  </div>
                  <pre className="text-[9px] font-mono p-2 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {JSON.stringify(debugResponse, null, 2)}
                  </pre>
                </Card>
              )}
            </div>
          ) : null}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsValidatorOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
