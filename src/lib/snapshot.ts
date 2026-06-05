import fs from "node:fs";
import path from "node:path";

// Institute verdicts — unified grading shape across every agency service.
// Populated by Backend B /api/institute/verdicts, bundled into snapshot.json by deploy.sh.
export type InstituteVerdictEntityType = "trade" | "voice_call" | "content" | "report";

export type InstituteEvidenceItem = {
  source: string;
  claim: string;
  weight: number;
};

export type InstituteDissentItem = {
  factor: string;
  note: string;
};

export type InstituteVerdict = {
  id?: number;
  entity_type: InstituteVerdictEntityType;
  entity_id: string;
  grade: "A" | "B" | "C";
  score: number;
  thesis: string;
  evidence_chain: InstituteEvidenceItem[];
  confidence: number;
  dissent: InstituteDissentItem[];
  strength_tags: string[];
  raw: Record<string, unknown>;
  created_at?: string;
};

export type InstituteVerdictMap = Partial<Record<InstituteVerdictEntityType, InstituteVerdict[]>>;

export type SourceVerdict = {
  source: string;
  color: "green" | "yellow" | "red";
  label: string;
  trades: number;
  wr: number;
  avg_pnl: number;
  total_pnl: number;
  window_used?: "24h" | "72h";
  trades_24h?: number;
  trades_72h?: number;
};

export type FundingBarDetail = {
  via_24h: boolean;
  via_72h: boolean;
  green_24h_count: number;
  green_72h_count: number;
};

export type BenchmarkSummary = {
  green: number;
  yellow: number;
  red: number;
  total_sources: number;
};

export type LiveSignal = {
  symbol: string | null;
  grade: string | null;
  source: string | null;
  price: number | null;
  market_cap: number | null;
  smart_money_count: number | null;
  age_minutes: number | null;
  price_change_1h: number | null;
  address: string | null;
};

export type OpenPosition = {
  id: number | null;
  symbol: string | null;
  source: string | null;
  status: string | null;
  entry_price: number | null;
  current_price: number | null;
  pnl_pct: number | null;
  entry_usd: number | null;
  grade: string | null;
  entered_at: string | null;
};

export type ScorecardStats = {
  total_trades?: number;
  live_trades?: number;
  paper_trades?: number;
  win_rate?: number;
  live_win_rate?: number;
  avg_pnl?: number;
  total_sol_in?: number;
  total_sol_out?: number;
  net_pnl_sol?: number;
  best_trade?: string;
  best_pnl?: number;
  worst_trade?: string;
  worst_pnl?: number;
};

export type ScorecardDay = {
  day: string;
  wins: number;
  losses: number;
  avg_pnl: number;
  trades: number;
};

export type ScorecardTopTrade = {
  symbol: string | null;
  grade: string | null;
  pnl_pct: number | null;
  narrative: string | null;
  source: string | null;
  wallet: string | null;
  ts: string | null;
  won: boolean | null;
};

export type InstituteTrade = {
  symbol: string | null;
  grade: string | null;
  source: string | null;
  narrative: string | null;
  smart_count: number | null;
  entry_price: number | null;
  exit_price: number | null;
  pnl_pct: number | null;
  entry_usd: number | null;
  entered_at: string | null;
  closed_at: string | null;
  exit_reason: string | null;
  wallet: string | null;
  wallet_type: string | null;
  mint: string | null;
  institute_score: number | null;
  risk_score: number | null;
  creator: string | null;
  has_confluence: number | null;
  top_holder_pct: number | null;
  narrative_velocity: string | null;
  vol_sustain: number | null;
  buy_pressure: number | null;
};

export type RecentTrade = {
  ts: string;
  symbol: string;
  grade: string | null;
  pnl_pct: number | null;
  won: boolean | null;
  exit_reason: string | null;
  wallet: string | null;
  live: boolean | null;
  source?: string | null;
  narrative?: string | null;
  entry_price?: number | null;
  exit_price?: number | null;
};

export type ReconciliationReport = {
  ok: boolean;
  timestamp: string | null;
  wallets_scanned: string[];
  orphans: number;
  ghosts: number;
  mismatches: number;
  elapsed_ms: number;
  last_detail: string;
};

export type Snapshot = {
  tunnels?: {
    capture?: string;
    clip?: string;
    pathapp?: string;
    backend?: string;
  };
  generated_at?: string;
  summary?: BenchmarkSummary;
  funding_bar_met?: boolean;
  funding_bar_detail?: FundingBarDetail;
  verdict?: SourceVerdict[];
  reconciliation?: ReconciliationReport;
  recent_trades?: RecentTrade[];
  live_signals?: LiveSignal[];
  open_positions?: OpenPosition[];
  institute_trades?: InstituteTrade[];
  institute_verdicts?: InstituteVerdictMap;
  scorecard_stats?: ScorecardStats;
  scorecard_daily?: ScorecardDay[];
  scorecard_top5?: ScorecardTopTrade[];
  [key: string]: unknown;
};

export function readSnapshot(): Snapshot {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "public", "snapshot.json"),
      "utf8",
    );
    return JSON.parse(raw) as Snapshot;
  } catch {
    return {};
  }
}

export function tunnelFor(
  slug: "capture" | "clip" | "pathapp",
): string | null {
  const snap = readSnapshot();
  return snap.tunnels?.[slug] ?? null;
}

export function benchmark(): {
  generated_at: string | null;
  summary: BenchmarkSummary | null;
  funding_bar_met: boolean;
  funding_bar_detail: FundingBarDetail | null;
  verdict: SourceVerdict[];
  reconciliation: ReconciliationReport | null;
  recent_trades: RecentTrade[];
  live_signals: LiveSignal[];
  open_positions: OpenPosition[];
  institute_trades: InstituteTrade[];
  institute_verdicts: InstituteVerdictMap;
  scorecard_stats: ScorecardStats;
  scorecard_daily: ScorecardDay[];
  scorecard_top5: ScorecardTopTrade[];
} {
  const snap = readSnapshot();
  return {
    generated_at: snap.generated_at ?? null,
    summary: snap.summary ?? null,
    funding_bar_met: Boolean(snap.funding_bar_met),
    funding_bar_detail: snap.funding_bar_detail ?? null,
    verdict: Array.isArray(snap.verdict) ? snap.verdict : [],
    reconciliation: snap.reconciliation ?? null,
    recent_trades: Array.isArray(snap.recent_trades) ? snap.recent_trades : [],
    live_signals: Array.isArray(snap.live_signals) ? snap.live_signals : [],
    open_positions: Array.isArray(snap.open_positions) ? snap.open_positions : [],
    institute_trades: Array.isArray(snap.institute_trades) ? snap.institute_trades : [],
    institute_verdicts: (snap.institute_verdicts && typeof snap.institute_verdicts === "object") ? (snap.institute_verdicts as InstituteVerdictMap) : {},
    scorecard_stats: (snap.scorecard_stats && typeof snap.scorecard_stats === "object") ? (snap.scorecard_stats as ScorecardStats) : {},
    scorecard_daily: Array.isArray(snap.scorecard_daily) ? snap.scorecard_daily : [],
    scorecard_top5: Array.isArray(snap.scorecard_top5) ? snap.scorecard_top5 : [],
  };
}

// Fetch verdicts for a specific entity_type from the snapshot.
export function instituteVerdicts(entityType: InstituteVerdictEntityType): InstituteVerdict[] {
  const map = benchmark().institute_verdicts;
  return Array.isArray(map?.[entityType]) ? (map[entityType] as InstituteVerdict[]) : [];
}
