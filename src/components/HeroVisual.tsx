"use client";

import { useEffect, useState } from "react";

// 2026-04-22 rewrite (Hassan TG 7411 flagged broken): Institute is now at
// actual geometric center (50, 50) with 5 product spokes, and active
// edges pulse continuously rather than toggling one-at-a-time. Labels
// moved to anchored positions so they don't clip at viewBox edges.

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  labelAnchor: "start" | "middle" | "end";
  labelDx?: number;
  labelDy?: number;
  hub?: boolean;
};

const NODES: Node[] = [
  { id: "institute", label: "Institute",      x: 50, y: 50, labelAnchor: "middle", labelDy: 7.5, hub: true },
  { id: "trading",   label: "PATH · Trading", x: 50, y: 14, labelAnchor: "middle", labelDy: -4 },
  { id: "voice",     label: "Voice Agent",    x: 14, y: 36, labelAnchor: "end",    labelDx: -3, labelDy: 1 },
  { id: "content",   label: "Content AI",     x: 86, y: 36, labelAnchor: "start",  labelDx: 3,  labelDy: 1 },
  { id: "reports",   label: "Reports",        x: 22, y: 80, labelAnchor: "end",    labelDx: -3, labelDy: 1 },
  { id: "mcp",       label: "MCP Toolkit",    x: 78, y: 80, labelAnchor: "start",  labelDx: 3,  labelDy: 1 },
];

// Hub-and-spoke: every product connects to Institute.
// Plus a few lateral edges where data actually crosses between products.
const EDGES: Array<{ from: string; to: string; lateral?: boolean }> = [
  { from: "trading",  to: "institute" },
  { from: "voice",    to: "institute" },
  { from: "content",  to: "institute" },
  { from: "reports",  to: "institute" },
  { from: "mcp",      to: "institute" },
  { from: "voice",    to: "reports", lateral: true },
  { from: "content",  to: "mcp",     lateral: true },
];

function getNode(id: string): Node {
  const n = NODES.find((n) => n.id === id);
  if (!n) throw new Error(`unknown node ${id}`);
  return n;
}

export function HeroVisual() {
  // Staggered pulse — three concurrent "data packets" travel along the 5 spoke
  // edges. Each packet is a point that slides from product → institute at a
  // different phase so the diagram always has visible motion.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40); // ~25fps
    return () => clearInterval(id);
  }, []);

  // Pick the 5 hub spokes (product → institute)
  const spokes = EDGES.filter((e) => e.to === "institute");

  return (
    <div className="relative w-full max-w-[480px] aspect-[4/3] mx-auto">
      <svg
        // 2026-04-23 fix (Hassan TG 7493 — labels clipped on mobile):
        // widen viewBox to give side labels ("Voice Agent", "Content AI")
        // 20 SVG units of horizontal padding. Institute (x=50) stays
        // horizontally centered because viewBox spans [-20, 120].
        viewBox="-20 0 140 100"
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 0 24px rgba(249,115,22,0.10))" }}
      >
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Hub soft glow behind Institute */}
        <circle cx={50} cy={50} r={16} fill="url(#hubGlow)" />

        {/* Base edges — always visible at low opacity */}
        {EDGES.map(({ from, to, lateral }) => {
          const a = getNode(from);
          const b = getNode(to);
          return (
            <line
              key={`base-${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={lateral ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)"}
              strokeWidth={lateral ? 0.25 : 0.4}
              strokeDasharray={lateral ? "1 1.4" : undefined}
            />
          );
        })}

        {/* Animated data packets on the 5 spokes, staggered phase */}
        {spokes.map(({ from, to }, i) => {
          const a = getNode(from);
          const b = getNode(to);
          // progress 0..1 along the edge, staggered per-spoke
          const period = 120; // ticks ≈ 4.8s
          const phase = (i * (period / spokes.length)) % period;
          const p = ((tick + phase) % period) / period;
          const px = a.x + (b.x - a.x) * p;
          const py = a.y + (b.y - a.y) * p;
          return (
            <g key={`pulse-${from}-${to}`}>
              {/* trailing segment that lights up */}
              <line
                x1={a.x}
                y1={a.y}
                x2={px}
                y2={py}
                stroke="#f97316"
                strokeOpacity={0.55}
                strokeWidth={0.5}
              />
              {/* leading packet dot */}
              <circle
                cx={px}
                cy={py}
                r={0.9}
                fill="#f97316"
                style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,0.9))" }}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.hub ? 3.2 : 2.1}
              fill={n.hub ? "#f97316" : "rgba(255,255,255,0.22)"}
              style={{
                filter: n.hub
                  ? "drop-shadow(0 0 5px rgba(249,115,22,0.7))"
                  : "drop-shadow(0 0 2px rgba(255,255,255,0.25))",
              }}
            />
            <text
              x={n.x + (n.labelDx ?? 0)}
              y={n.y + (n.labelDy ?? 5.5)}
              textAnchor={n.labelAnchor}
              fill={n.hub ? "rgba(255,196,120,0.85)" : "rgba(255,255,255,0.62)"}
              fontSize={n.hub ? "3" : "2.8"}
              fontFamily="Inter, sans-serif"
              fontWeight={n.hub ? 600 : 500}
              style={{ letterSpacing: "0.02em" }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
