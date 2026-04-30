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
 
   // Inline Pix props
   paymentData?: {
     orderId: string;
     accessToken: string;
     amount_cents: number;
     qr_code: string;
     qr_code_base64: string;
   } | null;
   paymentStatus?: string;
   isPollingPayment?: boolean;
   onResetPayment?: () => void;
 }