#!/bin/bash
# aegus-digital deploy.sh — refresh snapshot + rebuild + ship
set -euo pipefail
SITE_DIR="/Users/openclaw/Documents/Claude Code/Aegus/aegus-digital"
BACKEND="http://localhost:4001/api/benchmark/health"

cd "$SITE_DIR"

echo "1/3  refreshing public/snapshot.json from backend..."
if curl -sS -m 5 "$BACKEND" -o public/snapshot.json.tmp; then
    mv public/snapshot.json.tmp public/snapshot.json
    echo "     ok — $(wc -c < public/snapshot.json) bytes"
else
    echo "     WARN: backend unreachable, keeping existing snapshot"
    rm -f public/snapshot.json.tmp
fi

# Also fetch the reconciliation report so the trading dashboard can show
# whether on-chain state matches the DB. Fails soft if the endpoint is down.
RECON_JSON="$(curl -sS -m 5 http://localhost:4001/api/system/reconciliation 2>/dev/null || echo '')"
if [ -f public/snapshot.json ] && [ -n "$RECON_JSON" ]; then
    python3 - "$RECON_JSON" <<'PY'
import json, sys, pathlib
try:
    recon = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)
p = pathlib.Path("public/snapshot.json")
data = json.loads(p.read_text())
data["reconciliation"] = recon
p.write_text(json.dumps(data))
print(f"     reconciliation injected: ok={recon.get('ok')} detail={recon.get('last_detail')}")
PY
fi

# Fetch live signals feed and current open positions so PathDashboard can
# render real data instead of mocks.
SIGNALS_JSON="$(curl -sS -m 5 'http://localhost:4001/api/signals/live?limit=10' 2>/dev/null || echo '')"
POSITIONS_JSON="$(curl -sS -m 5 'http://localhost:4001/api/positions' 2>/dev/null || echo '')"
if [ -f public/snapshot.json ]; then
    python3 - "$SIGNALS_JSON" "$POSITIONS_JSON" <<'PY'
import json, sys, pathlib
sig_raw, pos_raw = sys.argv[1], sys.argv[2]
p = pathlib.Path("public/snapshot.json")
data = json.loads(p.read_text())
try:
    sigs = json.loads(sig_raw) if sig_raw else []
    if isinstance(sigs, list):
        keep = ("symbol","grade","source","price","market_cap","smart_money_count","age_minutes","price_change_1h","address")
        data["live_signals"] = [{k: s.get(k) for k in keep} for s in sigs[:10]]
except Exception:
    data["live_signals"] = []
try:
    poss = json.loads(pos_raw) if pos_raw else []
    if isinstance(poss, list):
        keep = ("id","symbol","source","status","entry_price","current_price","pnl_pct","entry_usd","grade","entered_at")
        data["open_positions"] = [{k: x.get(k) for k in keep} for x in poss if x.get("status")=="open"][:20]
except Exception:
    data["open_positions"] = []
p.write_text(json.dumps(data))
print(f"     live_signals={len(data.get('live_signals',[]))} open_positions={len(data.get('open_positions',[]))}")
PY
fi

# Fetch the 20 most recent trades for the dashboard "recent activity" strip.
# Keeps the snapshot small (we trim to what the UI needs).
SCORECARD_STATS_JSON="$(curl -sS -m 5 'http://localhost:4001/api/trades/stats?days=30' 2>/dev/null || echo '')"
SCORECARD_DAILY_JSON="$(curl -sS -m 5 'http://localhost:4001/api/trades/pnl/daily?days=14' 2>/dev/null || echo '')"
SCORECARD_TOPTRADES_JSON="$(curl -sS -m 5 'http://localhost:4001/api/trades?limit=500' 2>/dev/null || echo '')"
if [ -f public/snapshot.json ] && [ -n "$SCORECARD_STATS_JSON" ]; then
    python3 - "$SCORECARD_STATS_JSON" "$SCORECARD_DAILY_JSON" "$SCORECARD_TOPTRADES_JSON" <<'PY'
import json, sys, pathlib
stats_raw, daily_raw, top_raw = sys.argv[1], sys.argv[2], sys.argv[3]
p = pathlib.Path("public/snapshot.json")
data = json.loads(p.read_text())
try:
    data["scorecard_stats"] = json.loads(stats_raw) if stats_raw else {}
except Exception:
    data["scorecard_stats"] = {}
try:
    daily = json.loads(daily_raw) if daily_raw else {}
    data["scorecard_daily"] = (daily.get("days") or [])[-14:]
except Exception:
    data["scorecard_daily"] = []
try:
    trades = json.loads(top_raw) if top_raw else []
    if isinstance(trades, list):
        top5 = sorted(trades, key=lambda x: -(x.get("pnl_pct") or 0))[:5]
        keep = ("symbol","grade","pnl_pct","narrative","source","wallet","ts","won")
        data["scorecard_top5"] = [{k: t.get(k) for k in keep} for t in top5]
except Exception:
    data["scorecard_top5"] = []
p.write_text(json.dumps(data))
print(f"     scorecard injected: stats=ok daily={len(data['scorecard_daily'])} top5={len(data['scorecard_top5'])}")
PY
fi

# Institute verdicts from Backend B (:4002) — cross-domain grading for /reports,
# /voice-agent, /content, /mcp pages. Added 2026-04-15 per Option B architecture.
INST_VERDICTS_JSON="$(curl -sS -m 5 'http://localhost:4002/api/institute/verdicts?limit=50' 2>/dev/null || echo '')"
if [ -f public/snapshot.json ] && [ -n "$INST_VERDICTS_JSON" ]; then
    python3 - "$INST_VERDICTS_JSON" <<'PY'
import json, sys, pathlib
try:
    resp = json.loads(sys.argv[1])
    verdicts = resp.get("verdicts", [])
except Exception:
    sys.exit(0)
if not isinstance(verdicts, list):
    sys.exit(0)
by_type = {"trade": [], "voice_call": [], "content": [], "report": []}
for v in verdicts:
    t = v.get("entity_type")
    if t in by_type:
        by_type[t].append(v)
p = pathlib.Path("public/snapshot.json")
data = json.loads(p.read_text())
data["institute_verdicts"] = by_type
p.write_text(json.dumps(data))
counts = " ".join(f"{k}:{len(v)}" for k, v in by_type.items())
print(f"     institute_verdicts injected — {counts}")
PY
fi

INST_TRADES_JSON="$(curl -sS -m 5 'http://localhost:4001/api/trades/institute?limit=12' 2>/dev/null || echo '')"
if [ -f public/snapshot.json ] && [ -n "$INST_TRADES_JSON" ]; then
    python3 - "$INST_TRADES_JSON" <<'PY'
import json, sys, pathlib
try:
    inst = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)
if not isinstance(inst, list):
    sys.exit(0)
p = pathlib.Path("public/snapshot.json")
data = json.loads(p.read_text())
keep = (
    "symbol","grade","source","narrative","smart_count","entry_price","exit_price",
    "pnl_pct","entry_usd","entered_at","closed_at","exit_reason","wallet","wallet_type","mint",
    "institute_score","risk_score","creator","has_confluence","top_holder_pct",
    "narrative_velocity","vol_sustain","buy_pressure",
)
data["institute_trades"] = [{k: t.get(k) for k in keep} for t in inst[:12]]
p.write_text(json.dumps(data))
print(f"     institute_trades injected: {len(data['institute_trades'])}")
PY
fi

TRADES_JSON="$(curl -sS -m 5 http://localhost:4001/api/trades 2>/dev/null || echo '')"
if [ -f public/snapshot.json ] && [ -n "$TRADES_JSON" ]; then
    python3 - "$TRADES_JSON" <<'PY'
import json, sys, pathlib
try:
    trades = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)
if not isinstance(trades, list):
    sys.exit(0)
keep = ("ts", "symbol", "grade", "pnl_pct", "won", "exit_reason", "wallet", "live", "source", "narrative", "entry_price", "exit_price")
trimmed = [{k: t.get(k) for k in keep} for t in trades[:20]]
p = pathlib.Path("public/snapshot.json")
data = json.loads(p.read_text())
data["recent_trades"] = trimmed
p.write_text(json.dumps(data))
print(f"     recent_trades injected: {len(trimmed)}")
PY
fi

# Inject live tunnel URLs for the Studio demos if the tunnel state files exist.
# The /studio/<slug>/demo pages read these at build time and render an iframe.
SS_URL="$(cat "$HOME/.aegus/tunnels/capture.url" 2>/dev/null || cat "$HOME/.aegus/tunnels/scrollstopper.url" 2>/dev/null || echo '')"
VC_URL="$(cat "$HOME/.aegus/tunnels/clip.url" 2>/dev/null || cat "$HOME/.aegus/tunnels/viralclip.url" 2>/dev/null || echo '')"
PA_URL="$(cat "$HOME/.aegus/tunnels/pathapp.url" 2>/dev/null || echo '')"
BE_URL="$(cat "$HOME/.aegus/tunnels/backend.url" 2>/dev/null || echo '')"
if [ -f public/snapshot.json ] && [ -n "$SS_URL$VC_URL$PA_URL$BE_URL" ]; then
    python3 - "$SS_URL" "$VC_URL" "$PA_URL" "$BE_URL" <<'PY'
import json, sys, pathlib
ss, vc, pa, be = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
p = pathlib.Path("public/snapshot.json")
data = json.loads(p.read_text())
data.setdefault("tunnels", {})
if ss: data["tunnels"]["capture"] = ss
if vc: data["tunnels"]["clip"] = vc
if pa: data["tunnels"]["pathapp"] = pa
if be: data["tunnels"]["backend"] = be
p.write_text(json.dumps(data))
print(f"     tunnels injected: capture={bool(ss)} clip={bool(vc)} pathapp={bool(pa)} backend={bool(be)}")
PY
fi

echo "2/3  next build..."
npm run build >/dev/null 2>&1 || { echo "     FAIL"; exit 1; }
echo "     ok"

echo "3/3  vercel deploy..."
python3 "/Users/openclaw/Documents/Claude Code/Aegus/scripts/vercel_deploy.py" --name aegus-digital-v2 --dir "$SITE_DIR" | tail -6
