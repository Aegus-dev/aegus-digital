import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-canvas">
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <Image
              src="/aegus-wordmark-sm.png"
              alt="Aegus"
              width={129}
              height={22}
              className="h-[22px] w-auto"
            />
            <span className="text-[11px] uppercase tracking-[0.15em] text-fg-dim">
              Toronto · systems engineering
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-[12px] text-fg-dim">
            <Link href="/" className="hover:text-fg transition-colors">
              Home
            </Link>
            <Link href="/path" className="hover:text-fg transition-colors">
              PATH
            </Link>
            <Link href="/about" className="hover:text-fg transition-colors">
              About
            </Link>
            <Link
              href="https://github.com/Aegus-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg transition-colors"
            >
              GitHub
            </Link>
          </nav>
          <span className="text-[11px] text-fg-dim">
            © {new Date().getFullYear()} Aegus
          </span>
        </div>
        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="text-[11px] leading-[1.6] text-fg-dim md:text-[12px]">
            <span className="font-[590] text-fg/80">In active development.</span>{" "}
            Aegus PATH is a live work-in-progress. Features, gates, metrics,
            and the product roadmap may change without notice. Nothing on this
            site is financial advice — paper-trading only until the refund-
            criteria bar clears.
          </p>
        </div>
      </div>
    </footer>
  );
}
