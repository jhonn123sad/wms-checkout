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
    radius: theme.borderRadius || "16px",
    card: theme.card || "transparent"
  };

  const isPaid = paymentStatus === "paid";

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-2">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 bg-black/5 backdrop-blur-sm border border-black/5">
        <div className={`h-2 w-2 rounded-full ${isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-blue-500 animate-pulse'}`}></div>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {isPaid ? 'Pagamento confirmado' : 'Aguardando pagamento...'}
        </span>
      </div>

      <h3 className="text-lg font-bold mb-1 tracking-tight text-current">Pague com Pix</h3>
      <p className="text-[10px] text-gray-500 mb-4 text-center px-4 leading-relaxed opacity-70">
        Confirmação automática em segundos.
      </p>

      <div className="text-2xl font-black mb-4 tracking-tighter text-current">{formatPrice(paymentData.amount_cents)}</div>

      {/* QR Code Container */}
      <div className="relative group mb-4">
        <div className="absolute -inset-1.5 bg-current opacity-5 rounded-[20px] blur-sm"></div>
        <div className="relative w-36 h-36 bg-white p-2 rounded-[16px] border border-black/5 shadow-sm flex items-center justify-center overflow-hidden">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300 mb-2" />
              <p className="text-[9px] text-gray-400">Gerando QR...</p>
            </div>
          )}
        </div>
      </div>

      {/* Copy & Paste Box */}
      <div className="w-full space-y-1.5 mb-4">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Código Copia e Cola</p>
        <div className="w-full bg-black/5 rounded-lg p-2.5 border border-black/5 overflow-hidden group hover:border-black/10 transition-colors">
          <p className="text-[10px] font-mono break-all text-gray-500 text-center leading-tight select-all">
            {paymentData.qr_code}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-2.5">
        <button 
          onClick={handleCopy}
          className="w-full h-12 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/5 hover:brightness-110"
          style={{ backgroundColor: styles.button, color: styles.buttonText }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? "Copiado!" : "Copiar código Pix"}
        </button>

        <div className="flex flex-col gap-2 pt-1">
          <a 
            href={`/pagamento/${paymentData.orderId}?token=${paymentData.accessToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"
          >
            <ExternalLink size={10} />
            Abrir página de pagamento
          </a>
          
          {!isPaid && (
            <button 
              onClick={onReset}
              className="text-[9px] font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"
            >
              <RefreshCw size={10} />
              Alterar dados
            </button>
          )}
        </div>
      </div>
    </div>
  );
 };