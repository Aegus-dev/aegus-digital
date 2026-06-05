import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PATH",
  description:
    "How Aegus PATH discovers narratives across 22 signal engines and trades Solana memecoins, BTC, gold, and xStocks — with Institute-graded reasoning behind every entry.",
};

const EYEBROW =
  "text-[12px] font-[510] uppercase tracking-[0.15em] text-fg-dim";

const ASSET_CLASSES = [
  {
    name: "Solana memecoins",
    description:
      "Narrative-reawakening detection across the universe. Active-mover bridge, dormant-volume-spike, and equity-base sources gate entries on smart-money cohort + narrative tailwind.",
    engines: ["scout", "active_movers_to_signal_bridge", "narrative_awakening", "dormancy_watch", "dormant_volume_spike"],
  },
  {
    name: "Bitcoin",
    description:
      "RSI + EMA crossover strategies on 4h candles. Position sizing scaled by market regime (risk-on / risk-off).",
    engines: ["btc_trader", "btc_ema"],
  },
  {
    name: "Tokenized gold",
    description:
      "PAXG / XAUT spread arbitrage and DCA cycles. Macro inflation-hedge correlation overlay.",
    engines: ["gold_trader"],
  },
  {
    name: "xStocks equities",
    description:
      "Tokenized AAPLX / NVDAX / MSTRX / CRCLX / GOOGLX bases. Equity-base detector emits narrative-aligned entries with longer hold cadence (24h vs 12h NA cap).",
    engines: ["equity_base_detector"],
  },
] as const;

const PIPELINE = [
  {
    n: 1,
    name: "Discovery",
    body: "22 signal engines surface candidate tokens — gmgn trending, KOL flows, dormancy reawakenings, narrative momentum, on-chain whale flows.",
  },
  {
    n: 2,
    name: "Enrichment",
    body: "Each candidate enriched with rug-check scores, holder distribution, liquidity verification, narrative tags, and OHLCV-derived ATR.",
  },
  {
    n: 3,
    name: "Gates",
    body: "Rule-based gates (RugCheck, SolSniffer, smart-money cohort, source allowlist, asset-class routing, deep-research LLM verdict) reject anything that doesn't clear.",
  },
  {
    n: 4,
    name: "Entry",
    body: "Survivors get position-sized per source preset and asset class. Stop-loss, take-profit, and ATR-adaptive trail set at entry. Paper by default.",
  },
  {
    n: 5,
    name: "Exit",
    body: "Exit loop fires on TP / SL / trail-drop / time-based stale. Every close logged with realized PnL, gate-trace, and outcome attribution.",
  },
  {
    n: 6,
    name: "Audit",
    body: "Institute grades every signal post-hoc. Sources with negative paper edge get throttled. Engines with positive edge get promoted toward live.",
  },
];

export default function PathPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-12 md:px-6 md:pt-[120px] md:pb-[80px]">
          <FadeIn>
            <p className={EYEBROW}>Aegus PATH</p>
            <h1 className="mt-3 text-[40px] font-[510] leading-[1.05] tracking-[-1px] text-fg md:text-display-large max-w-[860px]">
              Memecoin research meets{" "}
              <span className="text-heat">multi-asset trading.</span>
            </h1>
            <p className="mt-6 max-w-[720px] text-body text-fg-dim md:text-body-lg">
              PATH is a memecoin research platform and a multi-asset trading
              platform. Discover narratives the moment they reawaken. Trade
              across four asset classes from one hub. Every entry routes
              through the same deterministic gate stack — no autonomous
              decisions, no black boxes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-[10px] bg-heat px-5 py-3 text-[14px] font-[590] text-canvas hover:bg-heat-hover transition-colors"
              >
                Open the PATH app <span aria-hidden>→</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Asset classes */}
      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-[120px]">
        <FadeIn>
          <span className={EYEBROW}>asset classes</span>
          <h2 className="mt-3 text-[32px] font-[510] leading-[1.05] tracking-[-0.7px] text-fg md:text-display max-w-[780px]">
            Four classes. One reasoning layer.
          </h2>
          <p className="mt-4 max-w-[640px] text-body text-fg-dim md:text-body-lg">
            Each class has its own engines tuned to its volatility, liquidity,
            and narrative cadence. All flow through the same gate stack so
            comparisons across classes use one shape of evidence.
          </p>
        </FadeIn>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {ASSET_CLASSES.map((a, i) => (
            <FadeIn key={a.name} delay={i * 80}>
              <article
                className="flex h-full flex-col gap-3 rounded-2xl border border-white/5 p-6 md:p-8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <h3 className="text-[20px] font-[590] tracking-[-0.3px] text-fg md:text-[22px]">
                  {a.name}
                </h3>
                <p className="text-body text-fg-dim">{a.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {a.engines.map((e) => (
                    <span
                      key={e}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-[2px] font-mono text-[10px] text-fg-dim"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-t border-white/5 bg-panel">
        <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-[120px]">
          <FadeIn>
            <span className={EYEBROW}>how it works</span>
            <h2 className="mt-3 text-[32px] font-[510] leading-[1.05] tracking-[-0.7px] text-fg md:text-display max-w-[780px]">
              Six-stage deterministic pipeline.
            </h2>
            <p className="mt-4 max-w-[640px] text-body text-fg-dim md:text-body-lg">
              No autonomous AI deciding trades. The LLM appears once as an
              advisory grading gate. Everything else is rule-based and
              reversible.
            </p>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PIPELINE.map((p, i) => (
              <FadeIn key={p.name} delay={i * 60}>
                <article className="flex flex-col gap-3 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[36px] font-[510] text-heat tracking-[-1px]">
                      0{p.n}
                    </span>
                    <h3 className="text-[16px] font-[590] uppercase tracking-[0.1em] text-fg">
                      {p.name}
                    </h3>
                  </div>
                  <p className="text-body text-fg-dim">{p.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Honest box */}
      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 md:py-[120px]">
        <FadeIn>
          <div
            className="rounded-2xl border border-heat/30 bg-heat/[0.04] p-8 md:p-12"
          >
            <span className={EYEBROW}>be honest with yourself</span>
            <h2 className="mt-3 text-[26px] font-[510] leading-[1.15] tracking-[-0.5px] text-fg md:text-[32px] max-w-[780px]">
              PATH is in live paper trading. It is not autonomous. You should
              not invest money on its signals yet.
            </h2>
            <p className="mt-4 max-w-[680px] text-body text-fg-dim md:text-body-lg">
              We measure paper-edge before any capital moves. Live trading is
              gated on a measurable refund-criteria bar — closes, weighted
              edge, win rate, and live-eligibility — sustained across a
              meaningful cohort. We publish our progress on{" "}
              <Link
                href="https://github.com/techieharry/botfam-sandbox"
                className="text-heat hover:underline underline-offset-4"
              >
                GitHub
              </Link>
              .
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
