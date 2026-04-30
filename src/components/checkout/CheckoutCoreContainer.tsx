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
   const searchParams = useSearch({ strict: false }) as any;
   const [isLoading, setIsLoading] = useState(false);
   const [paymentData, setPaymentData] = useState<any>(null);
   const [paymentStatus, setPaymentStatus] = useState("waiting_payment");
   const [isPolling, setIsPolling] = useState(false);
   const [formData, setFormData] = useState<Record<string, string>>({});
   const [utms, setUtms] = useState<Record<string, string>>({});
   const [error, setError] = useState<string | null>(null);
 
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
     if (!isPolling || !paymentData?.orderId || !paymentData?.accessToken || paymentStatus === 'paid') return;

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
 
   return <Component {...templateProps} />;
 };