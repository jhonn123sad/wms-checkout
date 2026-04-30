 import React, { useState, useEffect } from "react";
 import { useNavigate, useSearch } from "@tanstack/react-router";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 import { AppleCleanTemplate } from "./templates/AppleCleanTemplate";
 import { DarkPremiumTemplate } from "./templates/DarkPremiumTemplate";
 import { ImageLeftTemplate } from "./templates/ImageLeftTemplate";
 import { LongformSimpleTemplate } from "./templates/LongformSimpleTemplate";
 import { CustomEditableTemplate } from "./templates/CustomEditableTemplate";
 import { CreatorAccessTemplate } from "./templates/CreatorAccessTemplate";
 import { RecipeEbookTemplate } from "./templates/RecipeEbookTemplate";
 import { VisagismoAITemplate } from "./templates/VisagismoAITemplate";
 import { WMSCommunityTemplate } from "./templates/WMSCommunityTemplate";
 
 interface CheckoutCoreContainerProps {
   project: any;
   offer: any;
 }
 
 /**
  * CHECKOUT CORE CONTAINER
  * Responsável pela lógica, estado e integração com API.
  * NÃO ALTERAR LÓGICA DE PAGAMENTO AQUI SEM TESTE DE REGRESSÃO.
  */
 export const CheckoutCoreContainer: React.FC<CheckoutCoreContainerProps> = ({ project, offer }) => {
   const navigate = useNavigate();
   const searchParams = useSearch({ strict: false }) as Record<string, any>;
   const isPreviewMode = searchParams.previewPix === "1" || searchParams.previewPix === 1;
 
   const [isLoading, setIsLoading] = useState(false);
   const [paymentData, setPaymentData] = useState<any>(null);
   const [paymentStatus, setPaymentStatus] = useState("waiting_payment");
   const [isPolling, setIsPolling] = useState(false);
   const [formData, setFormData] = useState<Record<string, string>>({});
   const [utms, setUtms] = useState<Record<string, string>>({});
   const [error, setError] = useState<string | null>(null);
 
 
   // Handle Preview Mode
   useEffect(() => {
     if (isPreviewMode && !paymentData) {
       console.log("[Core] Ativando modo preview visual do Pix");
       setPaymentData({
         orderId: "preview",
         accessToken: "preview",
         qr_code: "00020101021226800014BR.GOV.BCB.PIX2558preview-pix-copia-e-cola-demo-para-design520400005303986540512.345802BR5920CHECKOUT PREVIEW6009SAO PAULO62070503***6304ABCD",
         qr_code_base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjxwYXRoIGQ9Ik00MCA0MEg4MFY4MEg0MFY0MFoiIGZpbGw9IiM5Y2EzYWYiLz48cGF0aCBkPSJNMTIwIDQwSDE2MFY4MEgxMjBWNDBaIiBmaWxsPSIjOWNhM2FmIi8+PHBhdGggZD0iTTQwIDEyMEg4MFYxNjBINTBWMTIwWiIgZmlsbD0iIzljYTNhZiIvPjxwYXRoIGQ9Ik0xMDAgODBIOHJWMTIwSDEwMFY4MFoiIGZpbGw9IiM5Y2EzYWYiLz48cGF0aCBkPSJNODAgMTIwaDIwdjIwSDgwdi0yMFoiIGZpbGw9IiM5Y2EzYWYiLz48cGF0aCBkPSJNMTIwIDEyMGg0MHY0MGgtNDB2LTQwWiIgZmlsbD0iIzljYTNhZiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzQ3NTVmOCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ09ERSBQUkVWSUVXPC90ZXh0Pjwvc3ZnPg==",
         amount_cents: offer.price_cents,
         status: "waiting_payment"
       });
     }
   }, [isPreviewMode, offer.price_cents, paymentData]);
 
   useEffect(() => {
     const capturedUtms: Record<string, string> = {};
     const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
     utmKeys.forEach(key => {
       if (searchParams[key]) capturedUtms[key] = String(searchParams[key]);
     });
     setUtms(capturedUtms);
   }, [searchParams]);
 
   const theme = project.theme_json || {};
   const content = project.content_json || {};
 
   const requiredFields = {
     collect_name: !!project.collect_name,
     collect_cpf: !!project.collect_cpf,
     collect_email: !!project.collect_email,
     collect_phone: !!project.collect_phone,
   };
 
   const formatPrice = (cents: number) => {
     return (cents / 100).toLocaleString('pt-BR', {
       style: 'currency',
       currency: 'BRL'
     });
   };
 
   const handleSubmit = async (e?: React.FormEvent) => {
     if (e) e.preventDefault();
 
     if (isPreviewMode) {
       toast.info("Modo Preview: Pix não será gerado na rede real.");
       return;
     }
 
     // Validations
     if (requiredFields.collect_name && !formData.name) return toast.error("Preencha o nome completo");
     if (requiredFields.collect_cpf && !formData.cpf) return toast.error("Preencha o CPF");
     if (requiredFields.collect_email && !formData.email) return toast.error("Preencha o e-mail");
     if (requiredFields.collect_phone && !formData.phone) return toast.error("Preencha o telefone");
 
     setIsLoading(true);
     setError(null);
 
     try {
       const { data, error: invokeError } = await supabase.functions.invoke("create-pix", {
         body: {
           project_slug: project.slug,
           customer_name: formData.name,
           customer_cpf: formData.cpf,
           customer_email: formData.email,
           customer_phone: formData.phone,
           offer_id: offer.id,
           ...utms
         },
       });
 
       if (invokeError || !data || data.error) {
         throw new Error(data?.error || invokeError?.message || "Erro ao gerar Pix");
       }
 
         console.log("[Core] Pix gerado com sucesso, orderId:", data.orderId);
         setPaymentData(data);
         setIsPolling(true);

         // Toast success
         toast.success("Pix gerado com sucesso!");

     } catch (err: any) {
       const msg = err.message || "Erro ao processar pagamento";
       setError(msg);
       toast.error(msg);
     } finally {
       setIsLoading(false);
     }
   };
 
   // Polling Logic
   useEffect(() => {
     if (!isPolling || !paymentData?.orderId || !paymentData?.accessToken || paymentStatus === 'paid' || isPreviewMode) return;

     let pollCount = 0;
     const maxPolls = (15 * 60) / 7; // 15 minutes, every 7 seconds

     const checkStatus = async () => {
       if (pollCount >= maxPolls) {
         setIsPolling(false);
         return;
       }
       pollCount++;

       try {
         const { data, error } = await supabase.functions.invoke("get-order-status", {
           body: { 
             orderId: paymentData.orderId, 
             token: paymentData.accessToken 
           },
           method: 'POST'
         });

         if (!error && data?.status === 'paid') {
           setPaymentStatus('paid');
           setIsPolling(false);
           toast.success("Pagamento confirmado!");
           
           if (data.thank_you_url) {
             setTimeout(() => {
               window.location.href = data.thank_you_url;
             }, 1500);
           }
         }
       } catch (err) {
         console.error("[Core Polling] Erro:", err);
       }
     };

     const interval = setInterval(checkStatus, 7000);
     return () => clearInterval(interval);
   }, [isPolling, paymentData, paymentStatus]);

   const templateProps = {
     project,
     offer,
     theme,
     content,
     formData,
     setFormData,
     requiredFields,
     isLoading,
     error,
       onSubmit: handleSubmit,
       formatPrice,
       paymentData,
       paymentStatus,
       isPollingPayment: isPolling,
       onResetPayment: () => {
         setPaymentData(null);
         setPaymentStatus("waiting_payment");
         setIsPolling(false);
       }
   };
 
   // Mapeamento automático por slug prioritário
   const slugTemplates: Record<string, any> = {
     'acesso-reservado': CreatorAccessTemplate,
     'receitas-praticas': RecipeEbookTemplate,
     'visagismo-ia': VisagismoAITemplate,
     'comunidade-wms': WMSCommunityTemplate
   };
 
   // Se o slug estiver mapeado, usa ele. Senão, usa theme.template ou fallback.
   const Component = slugTemplates[project.slug] || 
                   (theme.template === 'apple-clean' ? AppleCleanTemplate :
                    theme.template === 'dark-premium' ? DarkPremiumTemplate :
                    theme.template === 'image-left' ? ImageLeftTemplate :
                    theme.template === 'longform-simple' ? LongformSimpleTemplate :
                    theme.template === 'custom-editable' ? CustomEditableTemplate :
                    AppleCleanTemplate);
 
    return (
      <>
        {isPreviewMode && (
          <div className="fixed top-4 right-4 z-[9999] bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-600 animate-pulse">
            Preview visual do Pix
          </div>
        )}
        <Component {...templateProps} />
      </>
    );
 };