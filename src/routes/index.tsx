import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanLine, ArrowRight, ShieldCheck, ShieldAlert, ShieldX, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QR Shield — AI-Powered QR Code Threat Detection & Phishing Prevention" },
      { name: "description", content: "Scan QR codes safely. Our AI engine detects phishing links, malicious domains and suspicious URLs before you ever open them." },
    ],
  }),
  component: Index,
});

const features = [
  {
    title: "Decode any QR",
    desc: "Upload an image or scan with your camera. Reliable extraction across formats.",
  },
  {
    title: "Rule-based threat engine",
    desc: "Five weighted heuristics — HTTPS, shorteners, blacklist, keywords, domain anomalies.",
  },
  {
    title: "Phishing-aware",
    desc: "Brand impersonation and homograph detection catch fake-login pages before they load.",
  },
  {
    title: "Transparent scoring",
    desc: "Every score comes with the exact signals that produced it. No black box.",
  },
  {
    title: "Per-user history",
    desc: "Your scans are private. Search, filter, and revisit any past report.",
  },
  {
    title: "Built for the browser",
    desc: "Runs entirely client-side for decoding. Nothing leaves your device unnecessarily.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative border-b border-border bg-grid">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              QR threat intelligence
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Inspect every QR code <br className="hidden sm:block" />
              <span className="text-muted-foreground">before you trust it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              QR Shield decodes the embedded URL, runs it through a transparent
              threat engine, and tells you whether the link is safe, suspicious,
              or malicious — in under a second.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/app/scan">
                <Button size="default" className="h-10">
                  Start scanning <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="default" variant="outline" className="h-10">
                  Create account
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No tracking</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Open scoring rules</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Private history</span>
            </div>
          </div>

          {/* Mock report panel */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-border" />
                  <span className="h-2 w-2 rounded-full bg-border" />
                  <span className="h-2 w-2 rounded-full bg-border" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Report · LIVE</span>
              </div>
              <div className="space-y-4 px-5 py-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Decoded URL</p>
                  <p className="mt-1.5 break-all font-mono text-sm">http://paypa1-login.verify-account.tk/signin</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-sm border border-[color:var(--malicious)]/40 bg-[color:var(--malicious)]/10 px-2 py-0.5 text-xs font-medium text-[color:var(--malicious)]">
                      <ShieldX className="h-3 w-3" /> Malicious
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Score</p>
                    <p className="mt-0.5 font-display text-3xl font-semibold tabular-nums text-[color:var(--malicious)]">
                      87<span className="ml-1 font-mono text-xs text-muted-foreground">/100</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Signals</p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    <li>· Brand impersonation (paypal lookalike)</li>
                    <li>· No HTTPS</li>
                    <li>· Unusual TLD (.tk)</li>
                    <li>· Listed on internal blacklist</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT CATCHES */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              { Icon: ShieldCheck, label: "Safe", range: "0 – 30", desc: "Clean signals. The link can be opened normally." },
              { Icon: ShieldAlert, label: "Suspicious", range: "31 – 60", desc: "One or more risk indicators. Manual review recommended." },
              { Icon: ShieldX, label: "Malicious", range: "61 – 100", desc: "Strong phishing or impersonation patterns. Do not open." },
            ].map(({ Icon, label, range, desc }) => (
              <div key={label} className="border-l border-border pl-5">
                <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-sm font-medium">{label}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{range}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">01 — Capabilities</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              A small set of tools, sharply focused.
            </h2>
          </div>
          <div className="mt-12 grid divide-border border-border sm:grid-cols-2 sm:divide-x lg:grid-cols-3 lg:border-y">
            {features.map((f, i) => (
              <div key={f.title} className={`border-border p-6 ${i >= 3 ? "lg:border-t" : ""} ${i < features.length - 1 ? "border-b lg:border-b-0" : ""}`}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  0{i + 1}
                </p>
                <h3 className="mt-3 text-base font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">02 — Workflow</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            From QR to verdict in three steps.
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            {[
              { n: "01", t: "Capture", d: "Upload an image or point your camera at any QR code." },
              { n: "02", t: "Decode & analyze", d: "We extract the URL and run it through the threat engine." },
              { n: "03", t: "Decide", d: "Read the score and signals, then choose whether to open the link." },
            ].map((s) => (
              <li key={s.n} className="bg-card p-6">
                <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                <h3 className="mt-4 text-base font-medium">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6 py-14">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Stop scanning blind.
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Run your first scan in under thirty seconds.
            </p>
          </div>
          <Link to="/app/scan">
            <Button size="default" className="h-10">
              <ScanLine className="mr-2 h-3.5 w-3.5" /> Open the scanner
            </Button>
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground">
        <span>QR Shield · For educational and research use.</span>
        <span className="font-mono">v1.0</span>
      </footer>
    </div>
  );
}
