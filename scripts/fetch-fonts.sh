#!/usr/bin/env bash
# Downloads the latin subset of Ubuntu / Ubuntu Mono as woff2 into public/fonts
# so the site never makes a render-blocking request to fonts.googleapis.com.
# Committed to the repo; only re-run when changing weights.
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="public/fonts"
mkdir -p "$OUT"

UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36'
API='https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Ubuntu+Mono:wght@400;700&display=swap'

css=$(curl -4 -sS --compressed -A "$UA" --max-time 60 "$API")

# The API emits one @font-face per subset; keep only the latin blocks, then
# pair each family/weight with its URL so files land under readable names
# instead of Google's content hashes.
echo "$css" | awk '
  /\/\* latin \*\//        { keep = 1 }
  /\/\* (latin-ext|cyrillic|cyrillic-ext|greek|greek-ext|vietnamese) \*\// { keep = 0 }
  keep && /font-family/    { match($0, /'"'"'([^'"'"']+)'"'"'/, m); family = m[1] }
  keep && /font-weight/    { match($0, /([0-9]+)/, m); weight = m[1] }
  keep && /woff2/          {
    match($0, /https:[^)]+\.woff2/, m)
    slug = tolower(family); gsub(/ /, "-", slug)
    print slug "-" weight ".woff2", m[0]
  }
' | while read -r name url; do
  curl -4 -sS --max-time 60 -o "$OUT/$name" "$url"
  printf '%-24s %s KB\n' "$name" "$(( $(stat -c%s "$OUT/$name") / 1024 ))"
done

echo
echo "Saved to $OUT:"
ls -1 "$OUT"
