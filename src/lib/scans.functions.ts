import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { analyzeUrl } from "@/lib/threat/analyzer";

// POST /scan — analyze QR content + persist
export const analyzeScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ qrContent: z.string().min(1).max(4000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: bl } = await supabase.from("url_blacklist").select("domain");
    const blacklist = (bl ?? []).map((r) => r.domain);

    const result = analyzeUrl(data.qrContent, blacklist);

    const { data: inserted, error } = await supabase
      .from("scans")
      .insert({
        user_id: userId,
        qr_content: data.qrContent,
        url: result.url,
        threat_score: result.score,
        status: result.status,
        reasons: result.reasons,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: inserted.id,
      url: result.url,
      qrContent: data.qrContent,
      score: result.score,
      status: result.status,
      reasons: result.reasons,
      createdAt: inserted.created_at,
    };
  });

// GET /history — list scans with search + filter
export const listScans = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        search: z.string().max(200).optional(),
        status: z.enum(["safe", "suspicious", "malicious"]).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let q = supabase
      .from("scans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500);

    if (data.status) q = q.eq("status", data.status);
    if (data.search) q = q.or(`qr_content.ilike.%${data.search}%,url.ilike.%${data.search}%`);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// DELETE /history/:id
export const deleteScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("scans")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// GET /dashboard — analytics
export const getDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("scans")
      .select("id,status,threat_score,created_at,url,qr_content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const all = rows ?? [];
    const counts = { safe: 0, suspicious: 0, malicious: 0 };
    for (const r of all) counts[r.status as keyof typeof counts]++;

    // 30-day bucket series
    const days: Record<string, number> = {};
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
      days[d] = 0;
    }
    for (const r of all) {
      const d = r.created_at.slice(0, 10);
      if (d in days) days[d]++;
    }

    return {
      total: all.length,
      counts,
      series: Object.entries(days).map(([date, count]) => ({ date, count })),
      recent: all.slice(0, 5),
    };
  });