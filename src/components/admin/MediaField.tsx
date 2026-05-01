import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, X, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { MediaValue } from "@/components/public/MediaDisplay";
export type { MediaValue };

interface MediaFieldProps {
  value?: MediaValue;
  onChange: (value: MediaValue | undefined) => void;
  onUploading?: (uploading: boolean) => void;
  label?: string;
}

export const MediaField = ({ value, onChange, label, onUploading }: MediaFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState(value?.source !== "supabase" ? value?.url || "" : "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onUploading?.(true);
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${timestamp}-${safeFileName}.${fileExt}`;
      const filePath = `checkouts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("site-media")
        .getPublicUrl(filePath);

      const type = file.type.startsWith("video/") ? "video" : (file.type === "image/gif" ? "gif" : "image");

      const mediaData: MediaValue = {
        url: publicUrl,
        file_path: filePath,
        type,
        source: "supabase",
      };

      onChange(mediaData);
      toast.success("Mídia enviada com sucesso.");
    } catch (error: any) {
      toast.error("Erro no upload: " + (error.message || "Tente novamente."));
    } finally {
      setIsUploading(false);
      onUploading?.(false);
    }
  };

  const handleExternalUrl = () => {
    if (!externalUrl) return;
    
    let type: "image" | "video" | "gif" = "image";
    let source: MediaValue["source"] = "external";

    if (externalUrl.includes("youtube.com") || externalUrl.includes("youtu.be")) {
      type = "video";
      source = "youtube";
    } else if (externalUrl.includes("vimeo.com")) {
      type = "video";
      source = "vimeo";
    } else if (externalUrl.includes("drive.google.com")) {
      source = "gdrive";
      type = "video";
    } else if (externalUrl.toLowerCase().endsWith(".mp4") || externalUrl.toLowerCase().endsWith(".webm")) {
      type = "video";
    } else if (externalUrl.toLowerCase().endsWith(".gif")) {
      type = "gif";
    }

    onChange({ url: externalUrl, type, source });
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
            <img src={value.url} alt="Preview" className="max-h-full object-contain w-full h-full" />
          ) : (
            <div className="text-center p-4 w-full h-full flex flex-col items-center justify-center">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{value.source}</p>
              <p className="text-[10px] truncate max-w-[200px] text-muted-foreground/60">{value.url}</p>
              {value.type === "video" && (
                <div className="mt-2 text-primary">
                   <Loader2 className="w-4 h-4 animate-pulse" />
                </div>
              )}
            </div>
          )}
          <button 
            type="button"
            onClick={clearMedia}
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="upload" className="text-[10px]"><Upload className="w-3 h-3 mr-1" /> Upload</TabsTrigger>
            <TabsTrigger value="url" className="text-[10px]"><LinkIcon className="w-3 h-3 mr-1" /> URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-2">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer relative min-h-[100px]">
              <input 
                type="file" 
                onChange={handleUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*,video/*,.gif"
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <p className="text-[10px] text-muted-foreground text-center">Clique para subir imagem, vídeo ou GIF</p>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-2 space-y-2">
            <div className="flex gap-2">
              <Input 
                placeholder="https://..." 
                value={externalUrl} 
                onChange={(e) => setExternalUrl(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
              <Button size="sm" className="h-8 w-8 p-0" onClick={handleExternalUrl}>
                <Check className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground">YouTube, Vimeo, GDrive ou links diretos.</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};