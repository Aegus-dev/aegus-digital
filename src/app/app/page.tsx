import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { tunnelFor } from "@/lib/snapshot";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open the PATH app",
  description:
    "Launch the live Aegus PATH application — Solana wallet sign-in, paper trading, Institute-graded signals across four asset classes.",
};

const EYEBROW =
  "text-[12px] font-[510] uppercase tracking-[0.15em] text-fg-dim";

export default function AppLaunchPage() {
  // Pull the live tunnel URL injected at build time by deploy.sh
  const appUrl = tunnelFor("pathapp");

  return (
    <section className="mx-auto flex min-h-[calc(100vh-260px)] max-w-[920px] flex-col items-center justify-center gap-8 px-4 py-16 text-center md:px-6 md:py-[120px]">
      <FadeIn>
        <p className={EYEBROW}>PATH application</p>
        <h1 className="mt-3 text-[32px] font-[510] leading-[1.05] tracking-[-0.7px] text-fg md:text-[56px] max-w-[760px]">
          Sign in with your Solana wallet to enter PATH.
        </h1>
      </FadeIn>
      <FadeIn delay={120}>
        <p className="max-w-[560px] text-body text-fg-dim md:text-body-lg">
          Free. No credit card. No tiers. Wallet signature only — you stay in
          control of every key.
        </p>
      </FadeIn>
      <FadeIn delay={240}>
        {appUrl ? (
          <Link
            href={appUrl}
            className="inline-flex items-center gap-2 rounded-[12px] bg-heat px-6 py-4 text-[16px] font-[590] text-canvas transition-colors hover:bg-heat-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open PATH app <span aria-hidden>→</span>
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-[12px] border border-white/15 px-6 py-4 text-[14px] text-fg-dim">
            PATH app endpoint not currently published. Check back shortly.
          </div>
        )}
      </FadeIn>
      <FadeIn delay={360}>
        <p className="text-[12px] text-fg-dim">
          Heads up — PATH is currently live-paper. Read{" "}
          <Link href="/path" className="text-heat hover:underline underline-offset-4">
            how PATH works
          </Link>{" "}
          before sending real capital. We don&apos;t promote going live until
          the paper bar is hit.
        </p>
      </FadeIn>
    </section>
  );
}
