#!/usr/bin/env bash
# One-time setup after you create the GitHub repository: scripts/set-owner.sh <github-user-or-org>
set -euo pipefail
cd "$(dirname "$0")/.."
OWNER="${1:?Give your GitHub user or organisation name}"
sed -i "s#USERNAME#${OWNER}#g" desktop/package.json
echo "Updated desktop/package.json. The Flatpak id is made from the owner name at build time."
