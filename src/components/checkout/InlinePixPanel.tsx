import React from "react";
import { Loader2, Copy, Check, RefreshCw } from "lucide-react";
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

/**
 * INLINE PIX PANEL (REFORMULADO)
 * Exibe QR Code e código copia-e-cola com design limpo e profissional.
 * Removido links externos e botões redundantes.
 */
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
    accent: theme.accent || "#22c55e",
    button: theme.button || "#22c55e",
    buttonText: theme.buttonText || "#000000",
    radius: theme.borderRadius || "16px",
    card: theme.card || "transparent"
  };

  const isPaid = paymentStatus === "paid";

  const getQrImageSrc = (value?: string | null) => {
    if (!value) return "";
    if (value.startsWith("data:image")) return value;
    return `data:image/png;base64,${value}`;
  };

  const qrSrc = getQrImageSrc(paymentData?.qr_code_base64);

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-2 max-w-sm mx-auto">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 border transition-all duration-500 ${isPaid ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-gray-400'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-400 animate-pulse'}`}></div>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
        </span>
      </div>

      {/* QR Code Container */}
      <div className="relative group mb-8 flex items-center justify-center">
        <div className="relative z-10 bg-white p-3 rounded-xl shadow-lg w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center overflow-hidden transition-transform duration-500">
          {paymentData.qr_code_base64 ? (
            <img 
              src={qrSrc} 
              alt="QR Code Pix" 
              className="block w-full h-full max-w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-3" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gerando QR...</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center opacity-70 mb-8 max-w-[240px]">
        Escaneie o código acima no app do seu banco para pagar.
      </p>

      {/* Copy & Paste Box */}
      <div className="w-full space-y-2 mb-8">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Código Pix copia e cola</p>
        <div 
          onClick={handleCopy}
          className="w-full bg-white/[0.03] rounded-xl p-3 border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all overflow-hidden"
        >
          <p className="text-[10px] font-mono break-all text-gray-400 text-left leading-relaxed select-all">
            {paymentData.qr_code}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-4">
        <button 
          onClick={handleCopy}
          className="w-full h-[52px] rounded-xl font-black text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg hover:brightness-110 relative overflow-hidden group"
          style={{ backgroundColor: styles.button, color: styles.buttonText }}
        >
          <div className="relative flex items-center gap-2">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="uppercase tracking-widest italic">{copied ? "Copiado com Sucesso!" : "Copiar Código Pix"}</span>
          </div>
        </button>

        {!isPaid && (
          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white transition-all uppercase tracking-widest opacity-60 hover:opacity-100 py-2"
          >
            <RefreshCw size={12} />
            Voltar e alterar dados
          </button>
        )}
      </div>
    </div>
  );
};