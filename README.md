# AutoChess Chrome Extension
AutoChess is a Chrome extension project focused on helping users on Chess.com by surfacing useful game context now and, next, suggesting the best move from an engine.

## Progress Snapshot
### ✅ Implemented
- Manifest V3 extension scaffold is in place (`public/manifest.json`).
- Content script runs on Chess.com and extracts visible moves from the live game panel (`src/content.ts`).
- Background service worker receives/stores latest moves and forwards them to the popup (`public/background.js`).
- React popup UI renders captured moves in a table (`src/App.tsx`).
- Build pipeline outputs extension assets into `build/` (`vite.config.ts`).

### 🚧 In Progress / Not Yet Implemented
- Best-move recommendation engine is not integrated yet.
- Position extraction in FEN format is not implemented yet.
- No evaluation score, principal variation, or move-quality classification yet.
- Chess.com DOM selectors are still brittle and need hardening.
- No automated tests yet for parsing, messaging, or UI behavior.

## Current Architecture
- `src/content.ts`
  - Runs on `https://www.chess.com/*`.
  - Watches the move list container with `MutationObserver`.
  - Extracts move metadata (move number, piece, SAN-like move text).
  - Sends updates to the extension runtime.
- `public/background.js`
  - Maintains a cached `latestMoves` state.
  - Relays data between content script and popup.
  - Opens/focuses a popup window when extension action is clicked.
- `src/App.tsx`
  - Requests latest moves on mount.
  - Subscribes to forwarded updates from background script.
  - Displays moves in a table.

## Plan to Add "Next Best Move"
1. **Position fidelity**
   - Derive full board state (FEN) reliably from Chess.com page state.
   - Normalize move parsing and handle edge cases (castling, promotions, checks, mates).
2. **Engine integration**
   - Integrate a local Stockfish WASM worker for on-device analysis.
   - Pass FEN + analysis depth/time constraints from extension runtime.
3. **Recommendation UX**
   - Show best move, evaluation score, and optional top alternatives.
   - Add clear states: loading, unavailable position, and engine error.
4. **Stability and quality**
   - Harden selectors and add fallback discovery logic.
   - Add unit tests for parser and message contracts.
   - Add smoke tests for popup-content-background flow.

## Local Development
### Prerequisites
- Node.js 18+ (or 20+)

### Setup
```sh
npm install
```

### Run the app shell (Vite)
```sh
npm run dev
```

### Build extension assets
```sh
npm run build
```

## Create downloadable extension from CI
1. Go to **Actions** in GitHub.
2. Open the **Release Chrome Extension** workflow.
3. Click **Run workflow** and provide:
   - `tag` (for example: `v1.0.0`)
   - optional `release_name`
   - `prerelease` flag
4. After completion:
   - download the zip from the workflow artifact, or
   - open **Releases** and download `autochess-extension-<tag>.zip`.

## Load in Chrome
1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `build/` directory.

## Project Structure
- `public/manifest.json`: Extension configuration.
- `public/background.js`: MV3 service worker + message hub.
- `src/content.ts`: Chess.com move extraction and event forwarding.
- `src/App.tsx`: Popup UI.
- `vite.config.ts`: Build config (popup + content script entries).

## Git Notes
If you want to remove the current `origin` remote, use:

```sh
git remote remove origin
```

Your attempted command failed because `remove` is a subcommand of `git remote`, not `git`.
