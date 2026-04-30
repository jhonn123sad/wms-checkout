import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, X, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MediaValue {
  url: string;
  type: "image" | "video" | "gif";
  provider: "upload" | "external" | "youtube" | "vimeo" | "gdrive";
  id?: string;
}

interface MediaFieldProps {
  value?: MediaValue;
  onChange: (value: MediaValue | undefined) => void;
  label?: string;
}

export const MediaField = ({ value, onChange, label }: MediaFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState(value?.provider !== "upload" ? value?.url || "" : "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      const type = file.type.startsWith("video/") ? "video" : (file.type === "image/gif" ? "gif" : "image");

      const mediaData: MediaValue = {
        url: publicUrl,
        type,
        provider: "upload",
      };

      // Opcionalmente salvar na tabela media_assets aqui ou deixar para o salvamento da seção
      onChange(mediaData);
      toast.success("Mídia enviada com sucesso.");
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleExternalUrl = () => {
    if (!externalUrl) return;
    
    let type: "image" | "video" | "gif" = "image";
    let provider: MediaValue["provider"] = "external";

    if (externalUrl.includes("youtube.com") || externalUrl.includes("youtu.be")) {
      type = "video";
      provider = "youtube";
    } else if (externalUrl.includes("vimeo.com")) {
      type = "video";
      provider = "vimeo";
    } else if (externalUrl.includes("drive.google.com")) {
      provider = "gdrive";
      // GDrive pode ser imagem ou vídeo, mas geralmente é vídeo no contexto de checkout
      type = "video";
    } else if (externalUrl.endsWith(".mp4") || externalUrl.endsWith(".webm")) {
      type = "video";
    } else if (externalUrl.endsWith(".gif")) {
      type = "gif";
    }

    onChange({ url: externalUrl, type, provider });
    toast.success("URL externa configurada.");
  };

  const clearMedia = () => {
    onChange(undefined);
    setExternalUrl("");
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background/50">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      {value ? (
        <div className="relative group rounded-md overflow-hidden border bg-black/5 aspect-video flex items-center justify-center">
          {value.type === "image" || value.type === "gif" ? (
            <img src={value.url} alt="Preview" className="max-h-full object-contain" />
          ) : (
            <div className="text-center p-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{value.provider}</p>
              <p className="text-sm truncate max-w-[200px]">{value.url}</p>
            </div>
          )}
          <button 
            onClick={clearMedia}
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="text-xs"><Upload className="w-3 h-3 mr-2" /> Upload</TabsTrigger>
            <TabsTrigger value="url" className="text-xs"><LinkIcon className="w-3 h-3 mr-2" /> URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                onChange={handleUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*,video/*,.gif"
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">Clique para subir imagem, vídeo ou GIF</p>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Input 
                placeholder="https://..." 
                value={externalUrl} 
                onChange={(e) => setExternalUrl(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleExternalUrl}>
                <Check className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">Suporta YouTube, Vimeo, GDrive ou links diretos.</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};