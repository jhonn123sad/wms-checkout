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

/**
 * INLINE PIX PANEL (VALIDADO)
 * Exibe QR Code e código copia-e-cola com design premium dark.
 * NÃO ALTERAR A LÓGICA DE EXIBIÇÃO OU PERSISTÊNCIA.
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

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-2">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 border transition-all duration-500 ${isPaid ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-gray-400'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-400 animate-pulse'}`}></div>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isPaid ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
        </span>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-black mb-1 tracking-tight text-white uppercase italic">Pague via Pix</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed opacity-70">
          Liberação imediata após a confirmação
        </p>
      </div>

      {/* QR Code Container */}
      <div className="relative group mb-8">
        <div className="absolute -inset-4 bg-green-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
        <div className="relative w-48 h-48 bg-white p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
          {paymentData.qr_code_base64 ? (
            <img 
              src={paymentData.qr_code_base64} 
              alt="QR Code Pix" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-3" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gerando QR...</p>
            </div>
          )}
        </div>
      </div>

      {/* Copy & Paste Box */}
      <div className="w-full space-y-3 mb-8">
        <div className="flex items-center justify-between px-1">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Código Copia e Cola</p>
          <button onClick={handleCopy} className="text-[9px] font-black text-green-500 uppercase tracking-widest hover:text-green-400 transition-colors">Copiar</button>
        </div>
        <div 
          onClick={handleCopy}
          className="w-full bg-white/[0.03] rounded-2xl p-4 border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all group overflow-hidden"
        >
          <p className="text-[11px] font-mono break-all text-gray-400 text-center leading-relaxed select-all">
            {paymentData.qr_code}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-4">
        <button 
          onClick={handleCopy}
          className="w-full h-16 rounded-2xl font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl hover:brightness-110 relative overflow-hidden group"
          style={{ backgroundColor: styles.button, color: styles.buttonText }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative flex items-center gap-2">
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span className="uppercase tracking-widest italic">{copied ? "Copiado com Sucesso!" : "Copiar Código Pix"}</span>
          </div>
        </button>

        <div className="flex flex-col gap-3 pt-2">
          <a 
            href={`/pagamento/${paymentData.orderId}?token=${paymentData.accessToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-bold text-gray-500 hover:text-white flex items-center justify-center gap-2 transition-all uppercase tracking-[0.2em]"
          >
            <ExternalLink size={12} />
            Visualizar em nova aba
          </a>
          
          {!isPaid && (
            <button 
              onClick={onReset}
              className="text-[9px] font-bold text-gray-500 hover:text-white flex items-center justify-center gap-2 transition-all uppercase tracking-[0.2em]"
            >
              <RefreshCw size={12} />
              Voltar e alterar dados
            </button>
          )}
        </div>
      </div>
    </div>
  );
};