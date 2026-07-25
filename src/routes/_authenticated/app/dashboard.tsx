import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { getDashboard } from "@/lib/scans.functions";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { StatusBadge } from "@/components/qr/StatusBadge";
import { ShieldCheck, ShieldAlert, ShieldX, Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · QR Shield" }] }),
  component: DashboardPage,
});

const COLORS = {
  safe: "oklch(0.78 0.14 158)",
  suspicious: "oklch(0.80 0.14 75)",
  malicious: "oklch(0.66 0.20 25)",
};

function Kpi({ icon: Icon, label, value, color }: any) {
  return (
    <div className="border-l border-border pl-5 py-1">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={1.75} />
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const fetch = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetch() });

  return (
    <AppShell>
      <div className="mb-10 flex items-baseline justify-between border-b border-border pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Overview</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">Your scan activity, summarized.</p>
      </div>

      {isLoading || !data ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={Activity} label="Total scans" value={data.total} color="oklch(0.82 0.16 158)" />
            <Kpi icon={ShieldCheck} label="Safe" value={data.counts.safe} color={COLORS.safe} />
            <Kpi icon={ShieldAlert} label="Suspicious" value={data.counts.suspicious} color={COLORS.suspicious} />
            <Kpi icon={ShieldX} label="Malicious" value={data.counts.malicious} color={COLORS.malicious} />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h3 className="text-sm font-medium">Status breakdown</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">All time</span>
              </div>
              <div className="h-64 p-5">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Safe", value: data.counts.safe, color: COLORS.safe },
                        { name: "Suspicious", value: data.counts.suspicious, color: COLORS.suspicious },
                        { name: "Malicious", value: data.counts.malicious, color: COLORS.malicious },
                      ]}
                      dataKey="value"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {[COLORS.safe, COLORS.suspicious, COLORS.malicious].map((c, i) => (
                        <Cell key={i} fill={c} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "oklch(0.20 0.006 250)", border: "1px solid oklch(0.27 0.006 250)", borderRadius: 6, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h3 className="text-sm font-medium">Scan activity</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Last 30 days</span>
              </div>
              <div className="h-64 p-5">
                <ResponsiveContainer>
                  <LineChart data={data.series}>
                    <CartesianGrid stroke="oklch(0.27 0.006 250)" strokeDasharray="2 4" vertical={false} />
                    <XAxis dataKey="date" stroke="oklch(0.66 0.01 250)" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} axisLine={false} tickLine={false} />
                    <YAxis stroke="oklch(0.66 0.01 250)" tick={{ fontSize: 10 }} allowDecimals={false} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ background: "oklch(0.20 0.006 250)", border: "1px solid oklch(0.27 0.006 250)", borderRadius: 6, fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="oklch(0.82 0.16 158)" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="text-sm font-medium">Recent scans</h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Latest {data.recent.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 font-medium">URL / content</th>
                    <th className="px-5 py-2.5 font-medium">Score</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                      <td className="max-w-xs truncate px-5 py-2.5 font-mono text-xs">{r.url ?? r.qr_content}</td>
                      <td className="px-5 py-2.5 font-mono tabular-nums">{r.threat_score}</td>
                      <td className="px-5 py-2.5"><StatusBadge status={r.status as any} /></td>
                      <td className="px-5 py-2.5 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                  {data.recent.length === 0 && (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No scans yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}