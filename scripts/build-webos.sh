#!/usr/bin/env bash
# Builds the LG webOS package (.ipk). Needs Node.js; the webOS CLI is fetched with npx.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-dist/webos}"
STAGE="$(mktemp -d)"
cp src/index.html "$STAGE/index.html"
cp webos/appinfo.json webos/icon-v2.png webos/largeIcon-v2.png webos/splash.png "$STAGE/"
mkdir -p "$OUT"
npx --yes -p @webos-tools/cli ares-package "$STAGE" -o "$OUT"
rm -r "$STAGE"
ls -l "$OUT"
