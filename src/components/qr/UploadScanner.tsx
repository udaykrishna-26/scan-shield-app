import { useRef, useState } from "react";
import jsQR from "jsqr";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  onDecoded: (content: string) => void;
  loading?: boolean;
}

export function UploadScanner({ onDecoded, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setDecoded(null);

    const img = new Image();
    img.src = url;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (!code) {
      toast.error("No QR code detected in the image");
      return;
    }
    setDecoded(code.data);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-card/40 p-12 text-center transition-colors hover:border-foreground/30 hover:bg-card"
      >
        {preview ? (
          <img src={preview} alt="QR preview" className="max-h-64 rounded-sm border border-border" />
        ) : (
          <>
            <Upload className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium">Drop or click to upload</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">PNG · JPG · WEBP</p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {decoded && (
        <div className="rounded-md border border-border bg-card px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Decoded</p>
          <p className="mt-1 break-all font-mono text-sm">{decoded}</p>
        </div>
      )}

      <Button
        className="w-full"
        size="default"
        disabled={!decoded || loading}
        onClick={() => decoded && onDecoded(decoded)}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Analyze threat
      </Button>
    </div>
  );
}