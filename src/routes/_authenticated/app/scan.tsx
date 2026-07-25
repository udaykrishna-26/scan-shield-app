import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadScanner } from "@/components/qr/UploadScanner";
import { CameraScanner } from "@/components/qr/CameraScanner";
import { ResultCard } from "@/components/qr/ResultCard";
import { analyzeScan } from "@/lib/scans.functions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/app/scan")({
  head: () => ({ meta: [{ title: "QR Scanner · QR Shield" }] }),
  component: ScanPage,
});

function ScanPage() {
  const analyze = useServerFn(analyzeScan);
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof analyze>> | null>(null);

  const handle = async (qrContent: string) => {
    setLoading(true);
    try {
      const r = await analyze({ data: { qrContent } });
      setResult(r);
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["scans"] });
    } catch (e: any) {
      toast.error(e.message ?? "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-10 flex items-baseline justify-between border-b border-border pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Scanner</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Analyze a QR code</h1>
        </div>
        <p className="hidden max-w-sm text-sm text-muted-foreground sm:block">
          Upload an image or use your camera. The report appears on the right.
        </p>
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        <Tabs defaultValue="upload">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="upload"
              className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 text-sm text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Upload image
            </TabsTrigger>
            <TabsTrigger
              value="camera"
              className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 text-sm text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Live camera
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-6">
            <UploadScanner onDecoded={handle} loading={loading} />
          </TabsContent>
          <TabsContent value="camera" className="mt-6">
            <CameraScanner onDecoded={handle} loading={loading} />
          </TabsContent>
        </Tabs>
        <div>
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-md border border-dashed border-border bg-card/30 p-8 text-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Awaiting input</p>
                <p className="mt-2 text-sm text-muted-foreground">The threat report will render here once a QR is decoded.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}