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
  /** Pasta lógica dentro do bucket. Ex.: `checkouts/{checkoutId}` */
  pathPrefix?: string;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
];
const MAX_BYTES = 100 * 1024 * 1024; // 100MB

export const MediaField = ({
  value,
  onChange,
  label,
  onUploading,
  pathPrefix = "checkouts",
}: MediaFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState(
    value?.source !== "supabase" ? value?.url || "" : ""
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    if (file.size > MAX_BYTES) {
      const msg = `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo: 50 MB.`;
      setUploadError(msg);
      toast.error(msg);
      e.target.value = "";
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      const msg = `Tipo de arquivo não suportado: ${file.type || "desconhecido"}.`;
      setUploadError(msg);
      toast.error(msg);
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    onUploading?.(true);
    try {
      const fileExt = (file.name.split(".").pop() || "bin").toLowerCase();
      const timestamp = Date.now();
      const baseName =
        file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase()
          .slice(0, 60) || "file";
      const fileName = `${timestamp}-${baseName}.${fileExt}`;
      
      // O pathPrefix deve ser o slug se possível. 
      // O componente pai passa pathPrefix="checkouts/{slug}" ou similar.
      const filePath = `${pathPrefix}/${fileName}`;

      console.log("[MediaField] Upload start", {
        bucket: "checkout-assets",
        filePath,
        size: file.size,
        type: file.type,
      });

      const { error: uploadError } = await supabase.storage
        .from("checkout-assets")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("[MediaField] Upload error", uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("checkout-assets").getPublicUrl(filePath);

      let type: MediaValue["type"] = "image";
      if (file.type.startsWith("video/")) type = "video";
      else if (file.type === "image/gif") type = "gif";

      const mediaData: MediaValue = {
        url: publicUrl,
        file_path: filePath,
        type,
        source: "supabase",
        title: "",
        alt_text: "",
      };

      console.log("[MediaField] Upload OK", mediaData);
      onChange(mediaData);
      toast.success("Mídia enviada com sucesso.");
    } catch (error: any) {
      const msg =
        error?.message || error?.error || "Falha ao enviar arquivo. Tente novamente.";
      setUploadError(msg);
      toast.error("Erro no upload: " + msg);
    } finally {
      setIsUploading(false);
      onUploading?.(false);
      e.target.value = "";
    }
  };

  const handleExternalUrl = () => {
    const url = externalUrl.trim();
    if (!url) return;
    setUploadError(null);

    let type: MediaValue["type"] = "image";
    let source: MediaValue["source"] = "external_url";
    let embed_url: string | undefined;

    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      type = "youtube";
      source = "youtube";
      embed_url = toYouTubeEmbed(url);
    } else if (lowerUrl.includes("vimeo.com")) {
      type = "vimeo";
      source = "vimeo";
    } else if (lowerUrl.includes("drive.google.com")) {
      type = "video";
      source = "gdrive";
    } else if (lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm") || lowerUrl.endsWith(".mov")) {
      type = "video";
    } else if (lowerUrl.endsWith(".gif")) {
      type = "gif";
    }

    const next: MediaValue = { url, type, source, embed_url };
    console.log("[MediaField] External URL set", next);
    onChange(next);
    toast.success("URL configurada.");
  };

  const clearMedia = () => {
    console.log("[MediaField] Clear media");
    onChange(undefined);
    setExternalUrl("");
    setUploadError(null);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background/50">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {value ? (
        <div className="space-y-2">
          <div className="relative group rounded-md overflow-hidden border bg-black/5 aspect-video flex items-center justify-center">
            {value.type === "image" || value.type === "gif" ? (
              <img
                src={value.url}
                alt="Preview"
                className="max-h-full object-contain w-full h-full"
                onError={() =>
                  console.warn("[MediaField] Falha ao carregar preview da imagem", value.url)
                }
              />
            ) : value.type === "video" && value.source === "supabase" ? (
              <video src={value.url} controls className="w-full h-full object-contain bg-black" />
            ) : (
              <div className="text-center p-4 w-full h-full flex flex-col items-center justify-center bg-muted/40">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                  {value.type} · {value.source}
                </p>
                <p className="text-[10px] truncate max-w-[260px] text-muted-foreground/70">
                  {value.url}
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-2">
                  Preview embed só aparece no checkout público.
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={clearMedia}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-90 hover:opacity-100 transition-opacity"
              title="Remover mídia"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground break-all">
            <strong>{value.source}</strong> · {value.file_path || value.url}
          </p>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="upload" className="text-[10px]">
              <Upload className="w-3 h-3 mr-1" /> Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="text-[10px]">
              <LinkIcon className="w-3 h-3 mr-1" /> URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-2">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer relative min-h-[100px]">
              <input
                type="file"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-1">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <p className="text-[10px] text-muted-foreground">Enviando para o Storage...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <p className="text-[10px] text-muted-foreground text-center">
                    Clique para enviar JPG, PNG, WEBP, GIF, MP4, WEBM ou MOV (máx. 100 MB)
                  </p>
                </>
              )}
            </div>
            {uploadError && (
              <p className="text-[10px] text-destructive mt-2 break-words">{uploadError}</p>
            )}
          </TabsContent>

          <TabsContent value="url" className="mt-2 space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleExternalUrl();
                  }
                }}
                className="flex-1 h-8 text-xs"
              />
              <Button size="sm" className="h-8 w-8 p-0" onClick={handleExternalUrl}>
                <Check className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground">
              YouTube, Vimeo, GDrive ou links diretos (.mp4, .webm, .gif).
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

function toYouTubeEmbed(url: string): string {
  let videoId = "";
  try {
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("/embed/")) videoId = url.split("/embed/")[1].split("?")[0];
    else videoId = url.split("/").pop() || "";
  } catch {
    videoId = "";
  }
  return `https://www.youtube.com/embed/${videoId}`;
}
