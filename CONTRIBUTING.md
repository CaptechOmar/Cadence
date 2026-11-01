# Contributing

Thanks for helping. Cadence is one HTML file plus the packaging around it, so it is easy to get into.

## Run it

- **In a browser:** open `src/index.html`. Your Navidrome server has to allow cross-origin requests from the page, or serve the file from the same address as the server.
- **As the desktop app:** `cd desktop && npm install && npm start`.
- **With the TV layout in a browser:** add `?tv` to the address, for example `index.html?tv`.

## Where things are

| Path | What it is |
| --- | --- |
| `src/index.html` | The whole app: styles, markup and script |
| `webos/` | LG webOS package files (`appinfo.json`, icons, splash) |
| `desktop/` | Electron shell for Linux and Windows |
| `flatpak/` | Flatpak manifest, desktop entry and appstream data |
| `scripts/` | Build helpers |

## Making a change

1. Keep the app a single file with no build step and no runtime dependencies.
2. Test with the keyboard and a game controller, not only the mouse. Every screen should be fully usable with arrow keys, Enter and Escape.
3. Check the TV layout (`?tv`) and a small window.
4. Open a pull request that says what changed and why. A screenshot helps for visual changes.

## Releasing

`node scripts/set-version.mjs 2.15.0`, commit, then push a tag named `v2.15.0`. The release workflow builds everything and attaches it to a GitHub release.
