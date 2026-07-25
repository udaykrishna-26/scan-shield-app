import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { listScans, deleteScan } from "@/lib/scans.functions";
import { StatusBadge } from "@/components/qr/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/history")({
  head: () => ({ meta: [{ title: "Scan History · QR Shield" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const fetchList = useServerFn(listScans);
  const removeFn = useServerFn(deleteScan);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["scans", search, status],
    queryFn: () =>
      fetchList({
        data: {
          search: search || undefined,
          status: status === "all" ? undefined : (status as any),
        },
      }),
  });

  const onDelete = async (id: string) => {
    try {
      await removeFn({ data: { id } });
      qc.invalidateQueries({ queryKey: ["scans"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Scan deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AppShell>
      <div className="mb-10 flex items-baseline justify-between border-b border-border pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Records</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Scan history</h1>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search URL or content…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="suspicious">Suspicious</SelectItem>
            <SelectItem value="malicious">Malicious</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-2.5 font-medium">URL / content</th>
                <th className="px-5 py-2.5 font-medium">Score</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!isLoading && (data?.length ?? 0) === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No scans found.</td></tr>
              )}
              {data?.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="max-w-xs truncate px-5 py-2.5 font-mono text-xs">{r.url ?? r.qr_content}</td>
                  <td className="px-5 py-2.5 font-mono tabular-nums">{r.threat_score}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={r.status as any} /></td>
                  <td className="px-5 py-2.5 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-right">
                    <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}