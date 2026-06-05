import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { CountUp } from "@/components/CountUp";
import { benchmark } from "@/lib/snapshot";

const EYEBROW =
  "text-[12px] font-[510] uppercase tracking-[0.15em] text-fg-dim";

/* ─── Hero ───────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-14 md:px-6 md:pt-[120px] md:pb-[96px]">
        <p className={`${EYEBROW} mb-6 md:mb-8`}>
          Toronto · systems engineering
        </p>
        <FadeIn>
          <h1 className="text-[36px] font-[510] leading-[1.05] tracking-[-0.8px] text-fg md:text-display-hero max-w-[920px]">
            Memecoin research meets{" "}
            <span className="text-heat">multi-asset trading.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="mt-6 max-w-[720px] text-body text-fg-dim md:mt-8 md:text-body-lg">
            Aegus PATH discovers narratives the moment they reawaken and
            trades Solana memecoins, BTC, tokenized gold, and xStocks
            equities from one hub. Every signal Institute-graded. Every
            grade explained. Every dissent surfaced.
          </p>
        </FadeIn>
        <FadeIn delay={400}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-[10px] bg-heat px-5 py-3 text-[14px] font-[590] text-canvas transition-colors hover:bg-heat-hover"
            >
              Open the PATH app <span aria-hidden>→</span>
            </Link>
            <Link
              href="/path"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-5 py-3 text-[14px] font-[590] text-fg transition-colors hover:border-white/30"
            >
              How PATH works
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Proof strip ────────────────────────────────────────────────── */

function ProofStrip() {
  const snap = benchmark();
  const stats = (snap.scorecard_stats ?? {}) as Record<string, number>;
  const metrics = [
    { label: "paper trades", value: stats.total_trades ?? 1200, suffix: "+" },
    { label: "signal engines", value: 22, suffix: "" },
    { label: "uptime", value: 24, suffix: "/7" },
    { label: "asset classes", value: 4, suffix: "" },
  ];
  return (
    <section className="border-y border-white/5 bg-panel">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-10 px-6 py-14 md:grid-cols-4">
        {metrics.map((m, i) => (
          <FadeIn key={m.label} delay={i * 100}>
            <div className="flex flex-col gap-1">
              <span className="text-[56px] font-[700] tracking-[-1.5px] text-heat md:text-[72px]">
                <CountUp end={m.value} suffix={m.suffix} />
              </span>
              <span className="text-[13px] font-[590] uppercase tracking-[0.15em] text-fg-dim">
                {m.label}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ─── PATH product card ──────────────────────────────────────────── */

function PathCard() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-[120px]">
      <FadeIn>
        <span className={EYEBROW}>products</span>
        <h2 className="mt-3 text-[32px] font-[510] leading-[1.05] tracking-[-0.7px] text-fg md:text-display-large max-w-[820px]">
          One product live. More coming.
        </h2>
        <p className="mt-4 max-w-[640px] text-body text-fg-dim md:text-body-lg">
          Focused build: ship PATH to live profitability, then expand. Future
          products will route through the same reasoning layer — same grading
          shape, different domain.
        </p>
      </FadeIn>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <FadeIn delay={100}>
          <Link
            href="/path"
            className="group flex h-full flex-col gap-4 rounded-2xl border border-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-heat/30 hover:shadow-[0_0_24px_-8px_rgba(249,115,22,0.15)]"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <span className={EYEBROW}>Aegus PATH · live</span>
            <h3 className="text-display text-fg">
              Memecoin research + multi-asset trading
            </h3>
            <p className="text-body text-fg-dim">
              22 signal engines across Solana memecoins, BTC, tokenized gold,
              and xStocks. Narrative-reawakening detection, deep research
              gates, ATR-adaptive exits. Live paper trading; transparent
              reasoning behind every entry.
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {[
                "narrative discovery",
                "multi-asset",
                "Institute-graded",
                "live paper trading",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-heat/30 bg-heat/10 px-2 py-[2px] text-[10px] font-[590] uppercase tracking-[0.08em] text-heat"
                >
                  {t}
                </span>
              ))}
            </div>
            <span className="text-[11px] uppercase tracking-[0.12em] text-heat opacity-0 group-hover:opacity-100 transition-opacity">
              How PATH works →
            </span>
          </Link>
        </FadeIn>
        <FadeIn delay={200}>
          <div
            className="flex h-full flex-col gap-4 rounded-2xl border border-dashed border-white/10 p-8 opacity-70"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <span className={EYEBROW}>Roadmap</span>
            <h3 className="text-display text-fg">More products coming soon</h3>
            <p className="text-body text-fg-dim">
              We&apos;re focused on PATH. New products will roll out from the
              same reasoning layer once PATH is profitable live. Built in the
              open. Follow along on GitHub.
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {["focused build", "shared reasoning layer", "open roadmap"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/[0.03] px-2 py-[2px] text-[10px] font-[590] uppercase tracking-[0.08em] text-fg-dim"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Philosophy strip ───────────────────────────────────────────── */

function Philosophy() {
  return (
    <section className="border-t border-white/5 bg-canvas">
      <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-[120px]">
        <FadeIn>
          <span className={EYEBROW}>how we build</span>
          <h2 className="mt-3 text-[28px] font-[510] leading-[1.15] tracking-[-0.5px] text-fg md:text-[40px] max-w-[820px]">
            Grade every claim. Cite every source. Surface every dissent.
          </h2>
          <p className="mt-4 max-w-[680px] text-body text-fg-dim md:text-body-lg">
            One operator. One reasoning layer. No black boxes. Built in the
            open from Toronto. Every gate documented, every kill logged, every
            decision reversible.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function Page() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <PathCard />
      <Philosophy />
    </>
  );
}
