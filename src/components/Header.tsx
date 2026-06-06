import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/path", label: "PATH" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header className="border-b border-white/5 bg-canvas/80 backdrop-blur supports-[backdrop-filter]:bg-canvas/60">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 md:px-6 md:py-5">
        <Link href="/" className="flex items-center group" aria-label="Aegus home">
          <Image
            src="/aegus-wordmark-sm.png"
            alt="Aegus"
            width={141}
            height={24}
            priority
            className="h-6 w-auto transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:[filter:drop-shadow(0_0_10px_rgba(249,115,22,0.55))]"
          />
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-[13px] font-[510] text-fg-dim hover:text-fg hover:bg-white/5 transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/app"
            className="ml-2 rounded-lg bg-heat px-4 py-2 text-[13px] font-[590] text-canvas hover:bg-heat-hover transition-colors"
          >
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}
