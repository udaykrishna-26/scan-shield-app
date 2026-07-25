import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import type { ThreatStatus } from "@/lib/threat/analyzer";

const map = {
  safe: { label: "Safe", Icon: ShieldCheck, cls: "text-[color:var(--safe)] border-[color:var(--safe)]/40 bg-[color:var(--safe)]/10" },
  suspicious: { label: "Suspicious", Icon: ShieldAlert, cls: "text-[color:var(--suspicious)] border-[color:var(--suspicious)]/40 bg-[color:var(--suspicious)]/10" },
  malicious: { label: "Malicious", Icon: ShieldX, cls: "text-[color:var(--malicious)] border-[color:var(--malicious)]/40 bg-[color:var(--malicious)]/10" },
} as const;

export function StatusBadge({ status, className }: { status: ThreatStatus; className?: string }) {
  const { label, Icon, cls } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium", cls, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}