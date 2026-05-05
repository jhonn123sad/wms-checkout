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
  const [verifyingStatus, setVerifyingStatus] = useState(false);
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

  const [verificationResult, setVerificationResult] = useState<any>(null);

  const verifyLastOrderRedirect = async () => {
    setVerifyingStatus(true);
    setVerificationResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("verify-checkout-delivery", {
        body: { checkout_id: id }
      });

      if (error) throw error;
      
      setVerificationResult(data);

      if (data.ok) {
        toast.success(data.message);
      } else {
        if (data.code === "ORDER_NOT_FOUND") {
          toast.info(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err: any) {
      console.error("Erro na verificação:", err);
      toast.error("Erro na verificação: " + (err.message || "Erro inesperado"));
    } finally {
      setVerifyingStatus(false);
    }
  };

  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [validatorData, setValidatorData] = useState<any>(null);
  const [validatorLoading, setValidatorLoading] = useState(false);
  const [isConfirmingPaid, setIsConfirmingPaid] = useState(false);
  const [isConfirmingWaiting, setIsConfirmingWaiting] = useState(false);
  const [debugResponse, setDebugResponse] = useState<any>(null);

  const fetchValidatorData = async () => {
    if (isNew) return;
    setValidatorLoading(true);
    try {
      // 1. Checkout data
      const { data: checkoutData } = await supabase
        .from("checkouts")
        .select("*")
        .eq("id", id)
        .single();

      // 2. Product mapping
      const { data: projects } = await supabase
        .from("checkout_projects")
        .select("id, thank_you_url");
      
      const productData = projects && projects.length > 0 ? projects[0] : null;

      // 3. Last orders
      const { data: lastOrders } = await supabase
        .from("orders")
        .select("*")
        .filter("checkout_id", "eq", id)
        .order("created_at", { ascending: false })
        .limit(5);

      setValidatorData({
        checkout: checkoutData,
        product: productData,
        orders: lastOrders || []
      });
    } catch (err) {
      console.error("Error fetching validator data:", err);
      toast.error("Erro ao carregar dados de validação");
    } finally {
      setValidatorLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const payload: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'paid') {
        payload.paid_at = new Date().toISOString();
      } else {
        payload.paid_at = null;
      }

      const { error } = await supabase
        .from("orders")
        .update(payload)
        .eq("id", orderId);

      if (error) throw error;
      
      toast.success(`Order atualizada para ${status}`);
      await fetchValidatorData();
      setIsConfirmingPaid(false);
      setIsConfirmingWaiting(false);
    } catch (err: any) {
      toast.error("Erro ao atualizar status: " + err.message);
    }
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
                    disabled={verifyingStatus}
                  >
                    {verifyingStatus ? "Verificando..." : "Verificar Fluxo de Entrega (Última Order)"}
                  </Button>
                  
                  {verificationResult && (
                    <div className={`mt-3 p-3 rounded-md text-[11px] border ${
                      verificationResult.ok ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                      verificationResult.code === 'ORDER_NOT_FOUND' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                      'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      <p className="font-bold mb-1">{verificationResult.message}</p>
                      {verificationResult.success_redirect_url && (
                        <div className="mt-1 opacity-80 break-all">
                          <strong>URL destino:</strong> {verificationResult.success_redirect_url}
                        </div>
                      )}
                      {verificationResult.order_id && (
                        <div className="mt-1 opacity-60">
                          <strong>Order ID:</strong> {verificationResult.order_id}
                        </div>
                      )}
                    </div>
                  )}
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
                    <Info className="w-4 h-4" /> Dados do Checkout
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{validatorData.checkout.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slug:</span>
                      <span>{validatorData.checkout.slug}</span>
                    </div>
                    <div className="pt-1">
                      <p className="text-muted-foreground mb-1">Success Redirect URL:</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={validatorData.checkout.success_redirect_url ? "outline" : "destructive"} 
                          className={validatorData.checkout.success_redirect_url ? "text-green-500 border-green-500/20" : ""}>
                          {validatorData.checkout.success_redirect_url ? "Preenchida" : "Vazia"}
                        </Badge>
                      </div>
                      <p className="mt-1 font-mono text-[10px] break-all bg-muted/50 p-1 rounded">
                        {validatorData.checkout.success_redirect_url || "N/A"}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* 2 & 3. Produto & Sincronização */}
                <Card className="p-4 space-y-3">
                  <h3 className="font-bold flex items-center gap-2 text-sm border-b pb-2">
                    <Search className="w-4 h-4" /> Produto & Sincronização
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project Mapping:</span>
                      <Badge variant={validatorData.product ? "outline" : "destructive"}
                        className={validatorData.product ? "text-green-500 border-green-500/20" : ""}>
                        {validatorData.product ? "Existe" : "Não encontrado"}
                      </Badge>
                    </div>
                    {validatorData.product && (
                      <div className="pt-1">
                        <p className="text-muted-foreground mb-1">Thank You URL (Project):</p>
                        <p className="font-mono text-[10px] break-all bg-muted/50 p-1 rounded mb-2">
                          {validatorData.product.thank_you_url || "N/A"}
                        </p>
                        
                        <div className="flex items-center justify-between p-2 rounded border border-dashed">
                          <span>Sincronização:</span>
                          {validatorData.checkout.success_redirect_url === validatorData.product.thank_you_url ? (
                            <div className="flex items-center gap-1 text-green-500 font-bold">
                              <CheckCircle2 className="w-4 h-4" /> Sincronizado
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-yellow-500 font-bold">
                              <AlertTriangle className="w-4 h-4" /> Diferente (Aviso)
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* 4. Orders Vinculadas */}
              <Card className="p-4 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold flex items-center gap-2 text-sm">
                    <Play className="w-4 h-4" /> Últimas 5 Orders
                  </h3>
                  <Badge variant={validatorData.orders.length > 0 ? "outline" : "destructive"}
                    className={validatorData.orders.length > 0 ? "text-green-500 border-green-500/20" : "text-yellow-500 border-yellow-500/20"}>
                    {validatorData.orders.length > 0 ? `${validatorData.orders.length} encontradas` : "Nenhuma order gerada"}
                  </Badge>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-muted/50 uppercase text-muted-foreground">
                      <tr>
                        <th className="p-2">ID / Criado em</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Checkout ID</th>
                        <th className="p-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {validatorData.orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-muted/30">
                          <td className="p-2">
                            <div className="font-mono text-[9px]">{order.id}</div>
                            <div className="opacity-60">{format(new Date(order.created_at), 'dd/MM/yy HH:mm', { locale: ptBR })}</div>
                          </td>
                          <td className="p-2">
                            <Badge variant={order.status === 'paid' ? 'default' : 'secondary'} className={order.status === 'paid' ? 'bg-green-500' : ''}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant={order.checkout_id ? "outline" : "destructive"}>
                              {order.checkout_id ? "OK" : "NULL"}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-6 w-6" title="Copiar teste console" onClick={() => copyTestConsole(order.id, order.public_access_token)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-blue-500" title="Testar get-order-status" onClick={() => testGetOrderStatus(order.id, order.public_access_token)}>
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {validatorData.orders.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-[10px] h-8 bg-green-500/5 hover:bg-green-500/10 border-green-500/20 text-green-600"
                      onClick={() => setIsConfirmingPaid(true)}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Marcar última order como paga
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-[10px] h-8 bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                      onClick={() => setIsConfirmingWaiting(true)}
                    >
                      <RefreshCcw className="w-3 h-3 mr-1" /> Reverter última order para aguardando
                    </Button>
                  </div>
                )}
              </Card>

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

      {/* Confirmação Marcar como Pago */}
      <Dialog open={isConfirmingPaid} onOpenChange={setIsConfirmingPaid}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar alteração de status</DialogTitle>
            <DialogDescription>
              Isso é apenas para teste. Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-bold text-red-500">
              Confirmo que quero marcar a última order como paid manualmente.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmingPaid(false)}>Cancelar</Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={() => updateOrderStatus(validatorData.orders[0].id, 'paid')}
            >
              Confirmar e Marcar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação Reverter para Waiting */}
      <Dialog open={isConfirmingWaiting} onOpenChange={setIsConfirmingWaiting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reverter status de pagamento</DialogTitle>
            <DialogDescription>
              Deseja voltar a última order para "waiting_payment"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmingWaiting(false)}>Cancelar</Button>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={() => updateOrderStatus(validatorData.orders[0].id, 'waiting_payment')}
            >
              Reverter Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
