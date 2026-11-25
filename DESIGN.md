---
name: Tic Tac Toe
description: A three-in-a-row game with emoji stickers on printed-paper tiles.
colors:
  primary: "#9a2f3e"
  primary-tint: "#f8d7d6"
  primary-dark: "#ffc0bf"
  primary-tint-dark: "#5e303a"
  secondary: "#2450a7"
  secondary-tint: "#dce7ff"
  secondary-dark: "#b6caff"
  secondary-tint-dark: "#293d6c"
  draw: "#725414"
  draw-tint: "#fae8ae"
  draw-dark: "#ffe38c"
  draw-tint-dark: "#544522"
  paper: "#fbf2de"
  paper-dark: "#221f29"
  ink: "#262031"
  ink-dark: "#fff0df"
  muted: "#645752"
  muted-dark: "#cbbac4"
  tile: "#fffaf0"
  tile-dark: "#2d2935"
  tile-hover: "#f2e3c8"
  tile-hover-dark: "#3b3443"
  grid: "#dfcdb1"
  grid-dark: "#453c4d"
  rule: "#b9a587"
  rule-dark: "#807284"
  tile-edge: "#917c67"
  tile-edge-dark: "#887a8d"
  sticker-edge: "#fffdf6"
  sticker-edge-dark: "#fff1dc"
  backdrop: "#20192cb0"
  backdrop-dark: "#110e16c4"
typography:
  display:
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif'
    fontSize: "3.85rem"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.025em"
  headline:
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif'
    fontSize: "1.95rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  tally:
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif'
    fontSize: "2.1rem"
    fontWeight: 700
    lineHeight: 0.95
  body:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
  status:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 750
  label:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 700
  tally-label:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.2
  mark:
    fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
    fontSize: "4.5rem"
    lineHeight: 1
rounded:
  segment: "7px"
  control: "8px"
  tile: "9px"
  sticker: "13px"
  frame: "15px"
spacing:
  compact: "0.25rem"
  control-gap: "0.5rem"
  strip: "0.65rem"
  panel: "1rem"
  page-gutters: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.38rem 0.65rem"
  button-primary-dark:
    backgroundColor: "{colors.ink-dark}"
    textColor: "{colors.paper-dark}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.38rem 0.65rem"
  button-quiet-hover:
    backgroundColor: "{colors.tile-hover}"
  button-icon:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  segment:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.segment}"
    padding: "0.3rem 0.65rem"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  score-sticker:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sticker}"
  score-sticker-secondary:
    backgroundColor: "{colors.secondary-tint}"
    textColor: "{colors.secondary}"
  board:
    backgroundColor: "{colors.grid}"
    rounded: "{rounded.frame}"
  board-tile:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.tile}"
  board-tile-hover:
    backgroundColor: "{colors.tile-hover}"
  dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "{spacing.panel}"
  emoji-option:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.segment}"
    padding: "0.1rem"
---

# Design System: Tic Tac Toe

## Overview

**Creative North Star: "Sticker Duel"**

Sticker Duel takes its cues from a printed game box. Condensed lettering, ruled strips and square tiles give the surface structure. The players' emoji marks bring the color and movement.

Cream paper and dark ink set the light theme. The dark theme uses charcoal paper with brighter player inks. Each player's accent and backing repeat across their score sticker, occupied tiles and win state so their mark stays easy to follow.

**Key Characteristics**

- Paper, visible rules and rounded square tiles
- Condensed display lettering and tabular score numerals
- Player-colored emoji stickers with a brief, tile-local win animation

## Colors

### Primary

- **Player 1** uses berry-red ink and a blush backing in light mode, and pale pink ink and a muted berry backing in dark mode.

### Secondary

- **Player 2** uses cobalt ink and a pale blue backing in light mode, and periwinkle ink and a deep blue backing in dark mode. Cobalt and periwinkle also provide the focus ring and text-selection ink in their respective themes.

### Tertiary

- **Draw** uses ochre ink on a pale honey backing in light mode, and soft yellow ink on a muted amber backing in dark mode. The pair appears in the draw tally and tie message when a round ties.

### Neutral

- **Paper and ink** define the canvas, headings and main outlines. Active controls reverse the pair, setting paper text on an ink fill.
- **Tile, tile hover, grid and tile edge** distinguish playable squares, pointed-at squares, gutters and individual outlines.
- **Muted ink and rule** support small labels and horizontal separators. A translucent backdrop dims the game behind dialogs.
- **Sticker edge** is a pale outline around board marks in both themes.

**The Player Color Rule.** Carry the player's ink and backing through the scoreboard, mark picker, tile and win message. Use the separate draw pair for ties.

## Typography

Locally hosted Barlow Condensed Bold gives the title, dialog headlines and score numerals their printed shape. System UI text handles controls and explanatory copy. Platform color emoji fonts render the marks.

- **Display** uses `clamp(2.55rem, 8vw, 3.85rem)` for the title.
- **Headline** uses the fixed dialog heading size. **Tally** uses tabular numerals and `clamp(1.55rem, 7vw, 2.1rem)`.
- **Status and labels** use compact system text. The tally label scales with `clamp(0.69rem, 2.95vw, 0.8125rem)` and the board status uses the heavier status weight.
- **Board marks** scale with board width using `clamp(1.6rem, 15cqi, 4.5rem)`. The display, tally, tally label and mark tokens record their upper sizes.

**The Condensed Type Rule.** Use the condensed face for headings and scores. Keep controls and copy in the system UI face.

## Layout

The game uses one centered column capped at 30rem, with horizontal gutters totaling 2.5rem. At widths up to 350px the total gutters shrink to 1.5rem and the draws column narrows from 3.3rem to 2.25rem. Settings and action rows wrap. The score strip mirrors two flexible player columns around an automatic-width draws column.

The board spans the column as three equal tracks. Its padding and gutters share the same fluid range, from 0.3rem to 0.5rem. Each square maintains a 1:1 aspect ratio. Short phone viewports tighten the space above the board while preserving 44px touch targets. The emoji picker fills its available width with columns that start at 44px.

## Elevation & Depth

Paper, tile fills and thin outlines establish the layers. Board emoji use two tight drop shadows in the sticker-edge color to trace the cutout (2px below and 1px above). Dialogs use a translucent backdrop to distinguish the foreground panel.

**The Flat Surfaces Rule.** Use tonal separation and borders for paper surfaces. Reserve drop shadows for the cutout edge of board marks.

## Shapes

Use the small control radii for buttons and segments, the tile radius for individual squares and the frame radius for their shared container and dialogs. Score stickers have a softer corner than tiles. The shape of the board comes from square cells, a consistent gutter and a 2px ink outline.

## Components

### Buttons and segments

Text controls and theme controls start at 44px tall. The primary action uses an ink fill and paper text with an underline on hover. Quiet actions use muted text and gain a tinted background on hover. Segments use a tinted hover and the same ink and paper treatment for selection. The theme control pairs a line icon with a text label.

Interactive controls use a 2px focus outline with a 3px outset. Board cells bring the outline 4px inward so it stays inside each tile.

### Score stickers

A rounded square holds each player's mark and grows from 2.75rem to 3.75rem. The mark scales from 1.45rem to 2.1rem. Player 1's emoji tilts −7° and Player 2's tilts 6°. Editable marks have an underlined “Change sticker” action at 0.6875rem in the player's ink. Hover and active play use a player-colored border, and the active player's labels and score take the same ink.

### Board and result

Empty squares have paper-toned fills and individual edges. Playable squares preview the active sticker on hover or keyboard focus. Occupied squares use the player's paired backing and ink. A corner dot identifies the most recent move while the round is in progress. Winning squares add a 2px outline and deepen their backing by mixing 12% of the player ink into the tint. Above the board, the result banner uses the corresponding player or draw pair and places Play again alongside the outcome text. Both winning lines are emphasized when a single move completes two.

New marks settle into their tilt over 180ms. After a win, the winning stickers settle to 1.26× once, staggered in line order, and the other placed stickers shrink to 0.78×. The winning tally gives a brief tick. Reduced motion shows both sizes and the updated score immediately.

### Dialogs and emoji choices

Dialogs use a paper panel, a 2px ink border and the shared frame corners. The sticker picker opens on the current mark among a short list of suggestions. All stickers expands the library, and arrow keys move between choices. Slots use a tile fill, segment corners, and 1.25rem marks. Selected and hovered choices use a player-colored border and backing. Unavailable choices are dimmed.

## Do's and Don'ts

- **Do** keep the player accent and its backing paired in both themes.
- **Do** keep the board gutters and square outlines visible through the winning state.
- **Do** preserve the stationary enlargement when reduced motion is enabled.
- **Don't** draw a connecting stroke across the winning squares.
