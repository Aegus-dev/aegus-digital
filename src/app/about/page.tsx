import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aegus is a solo build out of Toronto. One operator, one reasoning layer, one focused product: PATH.",
};

const EYEBROW =
  "text-[12px] font-[510] uppercase tracking-[0.15em] text-fg-dim";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-[920px] px-4 pt-16 pb-12 md:px-6 md:pt-[120px] md:pb-[80px]">
          <FadeIn>
            <p className={EYEBROW}>About</p>
            <h1 className="mt-3 text-[40px] font-[510] leading-[1.05] tracking-[-1px] text-fg md:text-display-large max-w-[820px]">
              A solo build out of Toronto.
            </h1>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="mt-6 max-w-[680px] text-body text-fg-dim md:text-body-lg">
              Aegus is one operator and one reasoning layer, focused on a
              single product right now: PATH. Other products are shelved —
              not deleted — until PATH proves itself live. When they return,
              they&apos;ll route through the same Institute grading framework
              that powers PATH today.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Build philosophy */}
      <section className="mx-auto max-w-[920px] px-4 py-16 md:px-6 md:py-[120px]">
        <FadeIn>
          <span className={EYEBROW}>how we build</span>
          <h2 className="mt-3 text-[32px] font-[510] leading-[1.05] tracking-[-0.7px] text-fg md:text-display">
            Honest defaults.
          </h2>
        </FadeIn>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              eyebrow: "deterministic by default",
              body: "No autonomous AI deciding trades. The LLM appears once as an advisory grading gate. Everything else is rule-based and reversible.",
            },
            {
              eyebrow: "structured retrieval",
              body: "We pull from SQL, files, and cached snapshots into prompts. No vector embeddings, no RAG. Same shape of evidence every time.",
            },
            {
              eyebrow: "paper-first",
              body: "Every new strategy runs in paper for a measured cohort before live. We publish the refund-criteria bar and stick to it.",
            },
            {
              eyebrow: "build in the open",
              body: "Code lives on GitHub. Decisions, kills, throttles, and post-mortems all logged. No black boxes.",
            },
            {
              eyebrow: "free to use",
              body: "PATH is free. Sign in with a Solana wallet — nothing custodial, no tiers, no founder seats. You stay in control of every key.",
            },
            {
              eyebrow: "Toronto · systems engineering",
              body: "One operator, multiple AI specialists. Built from a Mac mini and a laptop, both in Toronto. Real cost, real edge.",
            },
          ].map((b, i) => (
            <FadeIn key={b.eyebrow} delay={i * 50}>
              <article className="flex flex-col gap-2">
                <span className={EYEBROW}>{b.eyebrow}</span>
                <p className="text-body text-fg">{b.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-panel">
        <div className="mx-auto max-w-[920px] px-4 py-16 text-center md:px-6 md:py-[80px]">
          <FadeIn>
            <h2 className="text-[26px] font-[510] leading-[1.15] tracking-[-0.5px] text-fg md:text-[32px]">
              See PATH in action.
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-[10px] bg-heat px-5 py-3 text-[14px] font-[590] text-canvas hover:bg-heat-hover transition-colors"
              >
                Open the PATH app <span aria-hidden>→</span>
              </Link>
              <Link
                href="/path"
                className="inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-5 py-3 text-[14px] font-[590] text-fg hover:border-white/30 transition-colors"
              >
                How PATH works
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
