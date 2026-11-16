#!/usr/bin/env bash
# Weekly unattended /tech-audit run, launched from the user's crontab:
#   0 6 * * 1  /home/kldl/Documents/shumaker-roofing/scripts/run-tech-audit.sh
#
# Runs Claude Code headless (-p) in the repo so the website-technical-agent plugin
# loads. Only the tools the audit needs are pre-approved; in -p mode anything else
# is denied instead of prompting. The skill posts its own Discord summary.
# Logs: .logs/tech-audit-<timestamp>.log (gitignored, last 12 kept).
#
# Test without running the audit:  TECH_AUDIT_PROMPT="Reply with the word OK" scripts/run-tech-audit.sh

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLAUDE="${CLAUDE_BIN:-$HOME/.local/bin/claude}"
PROMPT="${TECH_AUDIT_PROMPT:-/tech-audit}"
LOG_DIR="$REPO/.logs"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/tech-audit-$(date +%Y%m%d-%H%M%S).log"

# cron runs with a minimal environment
export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd "$REPO"

exec 9>"$LOG_DIR/tech-audit.lock"
if ! flock -n 9; then
  echo "$(date -Is) previous tech-audit still running; skipping" >>"$LOG_DIR/tech-audit-skipped.log"
  exit 0
fi

{
  echo "=== tech-audit start $(date -Is) prompt=$PROMPT"
  timeout 3h "$CLAUDE" -p "$PROMPT" \
    --allowedTools "Read" "Write" "Edit" "Glob" "Grep" "WebFetch" \
                   "Bash(curl:*)" "Bash(python3:*)" "Bash(date:*)" "Bash(mkdir:*)" "Bash(ls:*)" \
    --output-format text
  status=$?
  echo "=== tech-audit end $(date -Is) exit=$status"
} >>"$LOG" 2>&1 || echo "=== tech-audit FAILED $(date -Is) exit=$?" >>"$LOG"

# keep the 12 most recent logs (~3 months of weekly runs)
ls -1t "$LOG_DIR"/tech-audit-2*.log 2>/dev/null | tail -n +13 | xargs -r rm --
