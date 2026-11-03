#!/bin/sh
# Electron needs zypak to start its sandbox inside Flatpak.
export TMPDIR="$XDG_RUNTIME_DIR/app/$FLATPAK_ID"
exec zypak-wrapper /app/couchtunes/couchtunes --ozone-platform-hint=auto "$@"
