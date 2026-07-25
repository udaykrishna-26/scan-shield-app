// Pure rule-based threat analyzer. No external deps — runs both client and server.
import {
  SHORTENERS,
  SUSPICIOUS_KEYWORDS,
  SUSPICIOUS_TLDS,
  BRAND_TERMS,
  WEIGHTS,
} from "./constants";

export type ThreatStatus = "safe" | "suspicious" | "malicious";

export interface ThreatResult {
  url: string | null;
  isUrl: boolean;
  score: number;
  status: ThreatStatus;
  reasons: string[];
}

const IP_HOST = /^(\d{1,3}\.){3}\d{1,3}$/;

export function classify(score: number): ThreatStatus {
  if (score >= 61) return "malicious";
  if (score >= 31) return "suspicious";
  return "safe";
}

function tryParse(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    // Try prepending http:// to bare domains
    try {
      return new URL(`http://${raw}`);
    } catch {
      return null;
    }
  }
}

export function analyzeUrl(
  rawContent: string,
  blacklist: string[] = [],
): ThreatResult {
  const trimmed = rawContent.trim();
  const parsed = tryParse(trimmed);

  // Non-URL payload — treat as safe plain text
  if (!parsed || !/^https?:$/i.test(parsed.protocol)) {
    return {
      url: null,
      isUrl: false,
      score: 0,
      status: "safe",
      reasons: ["QR contains plain text (not a URL)"],
    };
  }

  const reasons: string[] = [];
  let score = 0;
  const host = parsed.hostname.toLowerCase();
  const full = parsed.href.toLowerCase();

  // 1. HTTPS check
  if (parsed.protocol !== "https:") {
    score += WEIGHTS.noHttps;
    reasons.push("No HTTPS — connection is not encrypted");
  }

  // 2. Short URL
  if (SHORTENERS.some((s) => host === s || host.endsWith("." + s))) {
    score += WEIGHTS.shortUrl;
    reasons.push("URL shortener detected — destination is hidden");
  }

  // 3. Suspicious keyword
  const foundKeyword = SUSPICIOUS_KEYWORDS.find((k) => full.includes(k));
  if (foundKeyword) {
    score += WEIGHTS.keyword;
    reasons.push(`Suspicious keyword detected: "${foundKeyword}"`);
  }

  // 4. Blacklist
  const hit = blacklist.find(
    (d) => host === d.toLowerCase() || host.endsWith("." + d.toLowerCase()),
  );
  if (hit) {
    score += WEIGHTS.blacklist;
    reasons.push(`Domain "${hit}" is on the phishing blacklist`);
  }

  // 5. Domain anomaly
  const anomalies: string[] = [];
  if (IP_HOST.test(host)) anomalies.push("IP address used instead of domain");
  if (SUSPICIOUS_TLDS.some((t) => host.endsWith(t)))
    anomalies.push(`unusual TLD (${host.split(".").pop()})`);
  const hyphenCount = (host.match(/-/g) || []).length;
  if (hyphenCount >= 3) anomalies.push("excessive hyphens in domain");
  if (host.split(".").length > 4) anomalies.push("excessive subdomains");
  // Brand impersonation: brand term not at the registrable root
  const brand = BRAND_TERMS.find((b) => host.includes(b));
  if (brand) {
    const parts = host.split(".");
    const root = parts.slice(-2, -1)[0] ?? "";
    if (root !== brand && !root.endsWith(brand)) {
      anomalies.push(`possible "${brand}" brand impersonation`);
    }
  }
  if (anomalies.length) {
    score += WEIGHTS.domainAnomaly;
    reasons.push("Domain anomaly: " + anomalies.join(", "));
  }

  score = Math.min(100, score);
  if (reasons.length === 0) reasons.push("No red flags detected");

  return {
    url: parsed.href,
    isUrl: true,
    score,
    status: classify(score),
    reasons,
  };
}