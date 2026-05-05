import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronRight, 
  Check,
  Copy,
  Loader2,
  Sparkles,
  Play,
  CreditCard,
  RefreshCw,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaDisplay } from "@/components/public/MediaDisplay";
import { toast } from "sonner";

interface DesignProps {
  checkout: any;
  formData: Record<string, string>;
  loading: boolean;
  paymentData: any;
  paymentStatus: string;
  mediaData: any;
  handleSubmit: (e: React.FormEvent) => Promise<any>;
  handleInputChange: (name: string, value: string) => void;
  handleResetPayment: () => void;
  InlinePixPanel: any; 
}

export function WmsNovoTesteCheckoutDesign({
  checkout,
  formData,
  loading,
  paymentData,
  paymentStatus,
  mediaData,
  handleSubmit,
  handleInputChange,
  handleResetPayment,
}: DesignProps) {
  
  return (
    <div className="min-h-screen bg-[#FFF0F0] font-mono selection:bg-red-500/20 flex flex-col items-center">
      <div className="w-full bg-red-600 text-white py-4 text-center font-black animate-pulse uppercase tracking-[0.3em]">
        Design de Teste - Radical Red Mode
      </div>

      <main className="w-full max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-12 rounded-[50px] shadow-[20px_20px_0px_#EF4444] border-4 border-black">
          
          <div className="space-y-8">
            <h1 className="text-6xl font-black text-black leading-none uppercase italic underline decoration-red-600">
              {checkout.title}
            </h1>
            
            <div className="bg-yellow-300 p-6 rotate-2 border-4 border-black shadow-[8px_8px_0px_#000]">
              <p className="text-xl font-bold text-black uppercase">
                {checkout.subtitle}
              </p>
            </div>

            <div className="flex gap-4">
              <div className="h-16 w-16 bg-blue-500 rounded-full border-4 border-black flex items-center justify-center">
                <Trophy className="text-white" />
              </div>
              <div className="h-16 w-16 bg-green-500 rounded-full border-4 border-black flex items-center justify-center">
                <Zap className="text-white" />
              </div>
              <div className="h-16 w-16 bg-purple-500 rounded-full border-4 border-black flex items-center justify-center">
                <Sparkles className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-[#111] p-10 rounded-[30px] border-4 border-black shadow-[-15px_15px_0px_#EF4444]">
            {paymentData ? (
              <PixGeneratedView 
                paymentData={paymentData}
                paymentStatus={paymentStatus}
                onReset={handleResetPayment}
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-white mb-8">
                  <span className="text-yellow-400 font-black text-6xl">
                    R$ {checkout.price}
                  </span>
                </div>

                {(checkout.checkout_fields || []).filter((f: any) => f.active).map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label className="text-white uppercase font-black">{field.field_label}</Label>
                    <Input
                      required={field.required}
                      className="bg-white border-4 border-yellow-400 h-14 font-black rounded-none"
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                    />
                  </div>
                ))}

                <Button className="w-full h-20 bg-red-600 hover:bg-red-700 text-white font-black text-2xl uppercase border-4 border-black shadow-[8px_8px_0px_#FFF] rounded-none">
                  {checkout.cta_text || "Comprar Agora!"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function PixGeneratedView({ paymentData, paymentStatus, onReset }: any) {
  const isPaid = paymentStatus === "paid";
  return (
    <div className="text-center space-y-8 py-10">
      <div className="text-4xl font-black text-white italic underline">PIX RADICAL</div>
      <div className="bg-white p-4 inline-block border-8 border-yellow-400 rotate-3">
        {paymentData.qr_code_base64 && (
          <img src={paymentData.qr_code_base64} alt="QR" className="w-64 h-64" />
        )}
      </div>
      <Button onClick={onReset} className="bg-white text-black font-black">VOLTAR</Button>
    </div>
  );
}

