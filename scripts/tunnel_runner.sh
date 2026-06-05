#!/usr/bin/env bash
# tunnel_runner.sh — run a cloudflared quick tunnel to a local port,
# capture the public URL, and keep the tunnel alive in the foreground
# so a parent LaunchAgent can supervise/respawn it.
#
# Usage:
#   tunnel_runner.sh <name> <local_url>
# Example:
#   tunnel_runner.sh capture http://Hassans-Mac-mini.local:8000
#
# On successful connect, writes the public URL to:
#   ~/.aegus/tunnels/<name>.url
# Also appends to ~/.aegus/tunnels/<name>.log for debugging.

set -euo pipefail

NAME="${1:?usage: tunnel_runner.sh <name> <local_url>}"
LOCAL_URL="${2:?usage: tunnel_runner.sh <name> <local_url>}"

STATE_DIR="$HOME/.aegus/tunnels"
URL_FILE="$STATE_DIR/$NAME.url"
LOG_FILE="$STATE_DIR/$NAME.log"
PID_FILE="$STATE_DIR/$NAME.pid"

mkdir -p "$STATE_DIR"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] starting tunnel $NAME -> $LOCAL_URL" >> "$LOG_FILE"

# Run cloudflared writing its own log to a private file we can grep.
CF_LOG="$STATE_DIR/$NAME.cfd.log"
: > "$CF_LOG"

/opt/homebrew/bin/cloudflared tunnel \
    --url "$LOCAL_URL" \
    --no-autoupdate \
    --logfile "$CF_LOG" \
    --loglevel info &
CF_PID=$!
echo "$CF_PID" > "$PID_FILE"

# Ensure the child dies with us
trap 'kill $CF_PID 2>/dev/null || true; exit 0' INT TERM

# Wait up to 20s for cloudflared to print the public URL
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
    sleep 1
    URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$CF_LOG" | head -1 || true)
    if [ -n "${URL:-}" ]; then
        echo "$URL" > "$URL_FILE"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $NAME resolved -> $URL" >> "$LOG_FILE"
        break
    fi
done

if [ ! -s "$URL_FILE" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $NAME FAILED to resolve URL within 20s" >> "$LOG_FILE"
fi

# Stay alive — LaunchAgent respawn semantics depend on us blocking.
wait $CF_PID
EXIT=$?
echo "[$(date '+%Y-%m-%d %H:%M:%S')] $NAME cloudflared exited $EXIT" >> "$LOG_FILE"
rm -f "$PID_FILE"
exit $EXIT
