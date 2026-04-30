 export interface CheckoutTemplateProps {
   project: any;
   offer: any;
   theme: any;
   content: any;
   formData: Record<string, string>;
   setFormData: (data: Record<string, string>) => void;
   requiredFields: {
     collect_name?: boolean;
     collect_cpf?: boolean;
     collect_email?: boolean;
     collect_phone?: boolean;
   };
   isLoading: boolean;
   error?: string | null;
   onSubmit: (e?: React.FormEvent) => void;
   formatPrice: (cents: number) => string;
 }