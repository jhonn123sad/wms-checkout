 import React from "react";
 import { Loader2, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
 import { toast } from "sonner";
 
 interface InlinePixPanelProps {
   paymentData: {
     orderId: string;
     accessToken: string;
     amount_cents: number;
     qr_code: string;
     qr_code_base64: string;
   };
   paymentStatus: string;
   onReset: () => void;
   formatPrice: (cents: number) => string;
   theme?: any;
 }
 
 export const InlinePixPanel: React.FC<InlinePixPanelProps> = ({
   paymentData,
   paymentStatus,
   onReset,
   formatPrice,
   theme = {}
 }) => {
   const [copied, setCopied] = React.useState(false);
 
   const handleCopy = () => {
     navigator.clipboard.writeText(paymentData.qr_code);
     setCopied(true);
     toast.success("Código Pix copiado!");
     setTimeout(() => setCopied(false), 3000);
   };
 
   const styles = {
     accent: theme.accent || "#0071E3",
     button: theme.button || "#000000",
     buttonText: theme.buttonText || "#FFFFFF",
     radius: theme.borderRadius || "16px"
   };
 
   const isPaid = paymentStatus === "paid";
 
   return (
     <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Status Badge */}
       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full mb-6">
         <div className={`h-2 w-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
           {isPaid ? 'Pagamento confirmado' : 'Aguardando pagamento...'}
         </span>
       </div>
 
       <h3 className="text-xl font-bold mb-1">Pague com Pix</h3>
       <p className="text-xs text-gray-500 mb-6 text-center px-4 leading-relaxed">
         Após pagar, a confirmação pode levar alguns segundos.
       </p>
 
       <div className="text-3xl font-black mb-8">{formatPrice(paymentData.amount_cents)}</div>
 
       {/* QR Code Container */}
       <div className="w-48 h-48 bg-white p-2 rounded-2xl border border-black/5 shadow-sm mb-8 flex items-center justify-center overflow-hidden">
         {paymentData.qr_code_base64 ? (
           <img 
             src={paymentData.qr_code_base64} 
             alt="QR Code Pix" 
             className="w-full h-full object-contain"
           />
         ) : (
           <div className="flex flex-col items-center justify-center text-center p-4">
             <Loader2 className="h-8 w-8 animate-spin text-gray-300 mb-2" />
             <p className="text-[10px] text-gray-400">Gerando QR Code...</p>
           </div>
         )}
       </div>
 
       {/* Copy & Paste Box */}
       <div className="w-full space-y-2 mb-8">
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Código Copia e Cola</p>
         <div className="w-full bg-black/5 rounded-xl p-3 border border-black/5 overflow-hidden">
           <p className="text-[10px] font-mono break-all text-gray-500 text-center leading-tight select-all">
             {paymentData.qr_code}
           </p>
         </div>
       </div>
 
       {/* Actions */}
       <div className="w-full space-y-3">
         <button 
           onClick={handleCopy}
           className="w-full h-14 rounded-xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/5"
           style={{ backgroundColor: styles.button, color: styles.buttonText }}
         >
           {copied ? <Check size={20} /> : <Copy size={20} />}
           {copied ? "Copiado!" : "Copiar código Pix"}
         </button>
 
         <div className="flex flex-col gap-2 pt-2">
           <a 
             href={`/pagamento/${paymentData.orderId}?token=${paymentData.accessToken}`}
             target="_blank"
             rel="noopener noreferrer"
             className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 transition-colors"
           >
             <ExternalLink size={12} />
             Abrir página de pagamento externa
           </a>
           
           {!isPaid && (
             <button 
               onClick={onReset}
               className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 transition-colors"
             >
               <RefreshCw size={12} />
               Voltar aos dados / Gerar outro Pix
             </button>
           )}
         </div>
       </div>
     </div>
   );
 };