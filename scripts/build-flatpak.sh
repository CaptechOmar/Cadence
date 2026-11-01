#!/usr/bin/env bash
# Builds a local Flatpak bundle:   scripts/build-flatpak.sh <github-owner>
# Needs flatpak and flatpak-builder, and `npm install && npm run dist:linux` already run in desktop/.
#   flatpak install flathub org.freedesktop.Platform//24.08 org.freedesktop.Sdk//24.08 org.electronjs.Electron2.BaseApp//24.08
set -euo pipefail
cd "$(dirname "$0")/.."
[ -d desktop/dist/linux-unpacked ] || { echo "Run 'npm install && npm run dist:linux' in desktop/ first."; exit 1; }
APP_ID="$(scripts/render-flatpak.sh "${1:?Give your GitHub user or organisation name, e.g. scripts/build-flatpak.sh octocat}")"
flatpak-builder --force-clean --user --install-deps-from=flathub --repo=flatpak/repo flatpak/build "flatpak/out/${APP_ID}.yml"
flatpak build-bundle flatpak/repo Cadence.flatpak "${APP_ID}"
echo "Built Cadence.flatpak (${APP_ID}). Install it with: flatpak install --user ./Cadence.flatpak"
