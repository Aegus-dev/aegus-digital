import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-canvas">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-2">
          <Image
            src="/aegus-wordmark.svg"
            alt="Aegus"
            width={80}
            height={18}
            className="h-[18px] w-auto"
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
        <span className="text-[11px] text-fg-dim">© {new Date().getFullYear()} Aegus</span>
      </div>
    </footer>
  );
}
