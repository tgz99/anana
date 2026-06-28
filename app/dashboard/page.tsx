import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Range = "today" | "7d" | "30d" | "all";

function getRangeStart(range: Range): Date | null {
  const now = new Date();
  switch (range) {
    case "today": {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

function pct(count: number, base: number) {
  if (base === 0) return "—";
  return `${((count / base) * 100).toFixed(1)}%`;
}

function relTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)}h lalu`;
}

const EVENT_COLORS: Record<string, string> = {
  page_view: "#3b82f6",
  wa_click: "#4ade80",
  kemitraan_click: "#fb923c",
  section_view: "#a78bfa",
  scroll_depth_75: "#facc15",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range = (["today", "7d", "30d", "all"].includes(searchParams.range ?? "")
    ? searchParams.range
    : "7d") as Range;
  const since = getRangeStart(range);
  const whereBase = since ? { createdAt: { gte: since } } : {};

  let totalViews = 0,
    totalWA = 0,
    totalKemitraan = 0,
    totalScroll = 0,
    uniqueSessions = 0,
    kemitraanSessions = 0,
    convertedSessions = 0;

  type WaSource = { source: string | null; _count: { _all: number } };
  type RecentEvent = {
    id: number;
    name: string;
    source: string | null;
    sessionId: string;
    createdAt: Date;
  };
  type DailyRow = { date: string; count: number };

  let waSources: WaSource[] = [];
  let recentEvents: RecentEvent[] = [];
  let daily: DailyRow[] = [];
  let dbError = false;

  try {
    [totalViews, totalWA, totalKemitraan, totalScroll, waSources, recentEvents] =
      await Promise.all([
        prisma.event.count({ where: { ...whereBase, name: "page_view" } }),
        prisma.event.count({ where: { ...whereBase, name: "wa_click" } }),
        prisma.event.count({ where: { ...whereBase, name: "kemitraan_click" } }),
        prisma.event.count({ where: { ...whereBase, name: "scroll_depth_75" } }),
        prisma.event.groupBy({
          by: ["source"],
          where: { ...whereBase, name: "wa_click" },
          _count: { _all: true },
        }),
        prisma.event.findMany({
          where: whereBase,
          orderBy: { createdAt: "desc" },
          take: 40,
          select: {
            id: true,
            name: true,
            source: true,
            sessionId: true,
            createdAt: true,
          },
        }),
      ]);

    waSources.sort((a, b) => b._count._all - a._count._all);

    const [sessionRows, kemitraanRows, waRows, resellerRows] = await Promise.all([
      prisma.event.groupBy({ by: ["sessionId"], where: whereBase }),
      prisma.event.groupBy({
        by: ["sessionId"],
        where: { ...whereBase, name: "section_view", source: "kemitraan" },
      }),
      prisma.event.groupBy({ by: ["sessionId"], where: { ...whereBase, name: "wa_click" } }),
      prisma.event.groupBy({
        by: ["sessionId"],
        where: { ...whereBase, name: "kemitraan_click" },
      }),
    ]);

    uniqueSessions = sessionRows.length;
    kemitraanSessions = kemitraanRows.length;

    const converted = new Set([
      ...waRows.map((r) => r.sessionId),
      ...resellerRows.map((r) => r.sessionId),
    ]);
    convertedSessions = converted.size;

    daily = await prisma.$queryRaw<DailyRow[]>`
      SELECT TO_CHAR("createdAt", 'MM/DD') as date,
             COUNT(*)::integer as count
      FROM "Event"
      WHERE name = 'page_view'
        AND "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR("createdAt", 'MM/DD')
      ORDER BY date ASC
    `;
  } catch (e) {
    console.error("[dashboard]", e);
    dbError = true;
  }

  const rangeLabels: Record<Range, string> = {
    today: "Hari Ini",
    "7d": "7 Hari",
    "30d": "30 Hari",
    all: "Semua",
  };

  const maxDaily = Math.max(...daily.map((d) => d.count), 1);
  const maxWA = waSources[0]?._count._all ?? 1;
  const convRate =
    totalViews > 0
      ? (((totalWA + totalKemitraan) / totalViews) * 100).toFixed(1)
      : "0";

  const funnelSteps = [
    {
      label: "Page Views",
      count: totalViews,
      note: "total kunjungan",
      color: "#3b82f6",
    },
    {
      label: "Unique Sessions",
      count: uniqueSessions,
      note: "pengunjung unik",
      color: "#06b6d4",
    },
    {
      label: "Scroll 75%",
      count: totalScroll,
      note: "baca sampai bawah",
      color: "#a78bfa",
    },
    {
      label: "Lihat Kemitraan",
      count: kemitraanSessions,
      note: "sampai section CTA",
      color: "#fb923c",
    },
    {
      label: "Konversi (WA / Reseller)",
      count: convertedSessions,
      note: "klik tombol utama",
      color: "#4ade80",
    },
  ];

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "var(--bg-900, #09090b)" }}
    >
      {/* Header */}
      <div
        className="border-b px-6 py-4 flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: "var(--card-stroke, #27272a)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-black"
            style={{ color: "var(--anana-red, #e11b22)" }}
          >
            anana
          </span>
          <span style={{ color: "var(--text-muted, #71717a)" }}>/</span>
          <span className="text-sm font-semibold">Analytics</span>
          <Link
            href="/"
            className="ml-2 text-xs px-2 py-1 rounded"
            style={{ color: "var(--text-muted)", background: "var(--bg-800, #18181b)" }}
          >
            ← Landing Page
          </Link>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {(["today", "7d", "30d", "all"] as Range[]).map((r) => (
            <Link
              key={r}
              href={`/dashboard?range=${r}`}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
              style={
                range === r
                  ? { background: "var(--accent-blue, #2d9cff)", color: "#fff" }
                  : { color: "var(--text-muted)", background: "transparent" }
              }
            >
              {rangeLabels[r]}
            </Link>
          ))}
          <Link
            href={`/dashboard?range=${range}&_=${Date.now()}`}
            className="ml-1 px-3 py-1 rounded-lg text-xs border transition-colors"
            style={{
              color: "var(--text-muted)",
              borderColor: "var(--card-stroke)",
            }}
          >
            ↻
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {dbError && (
          <div
            className="rounded-xl p-4 text-sm"
            style={{
              background: "rgba(127,29,29,0.3)",
              border: "1px solid rgba(185,28,28,0.4)",
              color: "#f87171",
            }}
          >
            Tidak dapat terhubung ke database. Pastikan container berjalan dan{" "}
            <code>prisma db push</code> sudah dijalankan.
          </div>
        )}

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Page Views",
              value: totalViews,
              sub: "total kunjungan",
              color: "#3b82f6",
            },
            {
              label: "Sessions",
              value: uniqueSessions,
              sub: "pengunjung unik",
              color: "#06b6d4",
            },
            {
              label: "WA Clicks",
              value: totalWA,
              sub: `${pct(totalWA, totalViews)} dari views`,
              color: "#4ade80",
            },
            {
              label: "Reseller Clicks",
              value: totalKemitraan,
              sub: `${pct(totalKemitraan, totalViews)} dari views`,
              color: "#fb923c",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl p-5"
              style={{
                background: "var(--bg-800, #18181b)",
                border: "1px solid var(--card-stroke, #27272a)",
              }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                {c.label}
              </p>
              <p
                className="text-3xl font-black mb-1"
                style={{ color: c.color }}
              >
                {c.value.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {c.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Conversion rate banner */}
        <div
          className="rounded-2xl px-6 py-4 flex items-center justify-between"
          style={{
            background: "var(--bg-800, #18181b)",
            border: "1px solid var(--card-stroke, #27272a)",
          }}
        >
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Overall conversion rate (WA + Reseller / Page Views)
          </span>
          <span className="text-2xl font-black" style={{ color: "#4ade80" }}>
            {convRate}%
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Conversion funnel */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--bg-800, #18181b)",
              border: "1px solid var(--card-stroke, #27272a)",
            }}
          >
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              Conversion Funnel
            </h2>
            <div className="space-y-4">
              {funnelSteps.map((step) => {
                const width =
                  totalViews > 0
                    ? Math.max((step.count / totalViews) * 100, 0)
                    : 0;
                return (
                  <div key={step.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "var(--text-muted)" }}>
                        {step.label}
                      </span>
                      <span className="font-bold">
                        {step.count.toLocaleString()}{" "}
                        <span
                          className="font-normal"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {pct(step.count, totalViews)}
                        </span>
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--bg-700, #27272a)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${width}%`,
                          backgroundColor: step.color,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <p
                      className="text-[10px] mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {step.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily trend */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--bg-800, #18181b)",
              border: "1px solid var(--card-stroke, #27272a)",
            }}
          >
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              Page Views — 7 Hari Terakhir
            </h2>
            {daily.length === 0 ? (
              <div
                className="flex items-center justify-center h-36 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Belum ada data
              </div>
            ) : (
              <div className="flex items-end gap-2 h-36">
                {daily.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                  >
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {d.count}
                    </span>
                    <div
                      className="w-full rounded-t min-h-[4px]"
                      style={{
                        height: `${(d.count / maxDaily) * 80}%`,
                        background:
                          "linear-gradient(to top, var(--accent-blue, #2d9cff), var(--accent-cyan, #19c8ff))",
                      }}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {d.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* WA clicks by source */}
        {waSources.length > 0 && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--bg-800, #18181b)",
              border: "1px solid var(--card-stroke, #27272a)",
            }}
          >
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              WA Clicks by Source
            </h2>
            <div className="space-y-3">
              {waSources.map((s) => (
                <div
                  key={String(s.source)}
                  className="flex items-center gap-3"
                >
                  <span
                    className="text-xs w-28 shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.source ?? "unknown"}
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-700, #27272a)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s._count._all / maxWA) * 100}%`,
                        background: "#4ade80",
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold w-6 text-right">
                    {s._count._all}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent events */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--bg-800, #18181b)",
            border: "1px solid var(--card-stroke, #27272a)",
          }}
        >
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            Recent Events
          </h2>
          {recentEvents.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Belum ada event yang tercatat.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr
                    className="uppercase tracking-wider"
                    style={{
                      color: "var(--text-muted)",
                      borderBottom: "1px solid var(--card-stroke, #27272a)",
                    }}
                  >
                    <th className="pb-2 text-left pr-4 font-semibold">Waktu</th>
                    <th className="pb-2 text-left pr-4 font-semibold">Event</th>
                    <th className="pb-2 text-left pr-4 font-semibold">Source</th>
                    <th className="pb-2 text-left font-semibold">Session</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((e) => (
                    <tr
                      key={e.id}
                      style={{
                        borderBottom: "1px solid var(--card-stroke, #27272a)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {relTime(e.createdAt)}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              EVENT_COLORS[e.name] ?? "var(--text-muted)",
                          }}
                        >
                          {e.name}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{e.source ?? "—"}</td>
                      <td
                        className="py-2 font-mono"
                        style={{ fontSize: "10px" }}
                      >
                        {e.sessionId.slice(0, 8)}…
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p
          className="text-center text-xs pb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Updated {new Date().toLocaleString("id-ID")} · Range:{" "}
          {rangeLabels[range]}
        </p>
      </div>
    </div>
  );
}
