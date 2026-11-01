#!/usr/bin/env bash
# Fills in the app id and owner in the Flatpak files and writes them to flatpak/out/.
# Usage: scripts/render-flatpak.sh <github-owner>      (prints the app id)
set -euo pipefail
cd "$(dirname "$0")/.."
OWNER="${1:?Give your GitHub user or organisation name}"
# Flatpak ids are lower-case words separated by dots; hyphens in a user name become underscores.
SAFE="$(echo "$OWNER" | tr 'A-Z-' 'a-z_')"
APP_ID="io.github.${SAFE}.Cadence"
OUT=flatpak/out
mkdir -p "$OUT"
cp flatpak/cadence.sh flatpak/cadence-*.png "$OUT/"
sed "s/@APP_ID@/${APP_ID}/g" flatpak/cadence.desktop > "$OUT/cadence.desktop"
sed -e "s/@APP_ID@/${APP_ID}/g" -e "s/@OWNER@/${OWNER}/g" flatpak/cadence.metainfo.xml > "$OUT/cadence.metainfo.xml"
sed "s/@APP_ID@/${APP_ID}/g" flatpak/cadence.yml > "$OUT/${APP_ID}.yml"
echo "$APP_ID"
