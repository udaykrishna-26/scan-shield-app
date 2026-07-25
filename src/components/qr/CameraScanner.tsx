import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onDecoded: (content: string) => void;
  loading?: boolean;
}

export function CameraScanner({ onDecoded, loading }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [active, setActive] = useState(false);
  const [decoded, setDecoded] = useState<string | null>(null);

  const start = async () => {
    if (!videoRef.current) return;
    try {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          setDecoded(result.data);
          scanner.stop();
          setActive(false);
        },
        { highlightScanRegion: true, highlightCodeOutline: true },
      );
      scannerRef.current = scanner;
      await scanner.start();
      setActive(true);
    } catch (e) {
      toast.error("Could not access camera");
      console.error(e);
    }
  };

  const stop = () => {
    scannerRef.current?.stop();
    setActive(false);
  };

  useEffect(() => () => scannerRef.current?.destroy(), []);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-border bg-black aspect-video flex items-center justify-center">
        <video ref={videoRef} className="h-full w-full object-cover" />
      </div>

      <div className="flex gap-2">
        {!active ? (
          <Button onClick={start} className="flex-1" variant="outline" size="default">
            <Camera className="mr-2 h-3.5 w-3.5" /> Start camera
          </Button>
        ) : (
          <Button onClick={stop} className="flex-1" variant="outline" size="default">
            <CameraOff className="mr-2 h-3.5 w-3.5" /> Stop
          </Button>
        )}
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