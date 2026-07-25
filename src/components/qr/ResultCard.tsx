import { StatusBadge } from "./StatusBadge";
import type { ThreatStatus } from "@/lib/threat/analyzer";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  result: {
    url: string | null;
    qrContent: string;
    score: number;
    status: ThreatStatus;
    reasons: string[];
  };
}

const scoreColor: Record<ThreatStatus, string> = {
  safe: "text-[color:var(--safe)]",
  suspicious: "text-[color:var(--suspicious)]",
  malicious: "text-[color:var(--malicious)]",
};

export function ResultCard({ result }: Props) {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Report</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            #{Math.random().toString(36).slice(2, 8).toUpperCase()}
          </span>
        </div>
        <StatusBadge status={result.status} />
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="col-span-2 px-5 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Decoded URL</p>
          <p className="mt-1.5 break-all font-mono text-sm leading-snug">
            {result.url ?? result.qrContent}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Threat score</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={"font-display text-4xl font-semibold tabular-nums " + scoreColor[result.status]}>
              {result.score}
            </span>
            <span className="font-mono text-xs text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Signals detected
        </p>
        <ul className="mt-3 space-y-2">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="leading-snug">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border px-5 py-3">
        {result.url && result.status === "safe" ? (
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              Open link <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        ) : result.url ? (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Recommendation:</span>{" "}
            do not open this link. Copy the URL and inspect it manually if necessary.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Decoded content is not a URL.</p>
        )}
      </div>
    </div>
  );
}