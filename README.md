# Tic Tac Toe

Play locally with two players or against the computer. Choose emoji for your marks and play three in a row. Each mode has its own scoreboard. Rounds, scores, and emoji choices reset on reload. The light or dark theme preference persists when browser storage is available.

## Setup

Use Node.js 20.9 or later and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Project structure

- `app/page.tsx` renders the game at `/`. The root layout sets metadata and restores the saved theme before rendering the game.
- `app/_game/game.tsx` connects the screen to the reducer and schedules computer turns. The board, settings, emoji picker, and scoreboard live alongside it.
- `app/_game/game-state.ts` owns round transitions, selections, and per-mode scores. `game-logic.ts` handles board outcomes and computer move selection.
- `app/globals.css` contains theme variables and base styles. The game’s CSS Module scopes screen-specific styles to its components.

The Next.js configuration enables Cache Components and Partial Prefetching together. It also enables development agent feedback and selects the TypeScript compiler API for Next.js builds.

## Verification

```sh
npm test
npm run lint
npx next typegen
npx tsc --noEmit
npm run build
```

The rule and state tests use TypeScript and Node’s built-in test runner. For UI changes, check local and computer play, a setting change during the computer’s turn, keyboard operation of the emoji dialog, and both themes at desktop and mobile widths.
