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
       
       navigate({ 
         to: `/pagamento/${data.orderId}`, 
         search: { token: data.accessToken } 
       } as any);
       
     } catch (err: any) {
       const msg = err.message || "Erro ao processar pagamento";
       setError(msg);
       toast.error(msg);
     } finally {
       setIsLoading(false);
     }
   };
 
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
     formatPrice
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