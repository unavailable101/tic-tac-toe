import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { emojiLibrary, presets, type Emoji } from "./emojis";
import type { Player } from "./game-logic";
import styles from "./game.module.css";

type EmojiPickerProps = {
  name: string;
  player: Player;
  selected: Emoji;
  taken: Emoji;
  hasMoves: boolean;
  onPick: (emoji: Emoji) => void;
};

export function EmojiPicker({ name, player, selected, taken, hasMoves, onPick }: EmojiPickerProps) {
  const [showAll, setShowAll] = useState(false);
  const [focusedSymbol, setFocusedSymbol] = useState(selected.symbol);
  const dialog = useRef<HTMLDialogElement>(null);
  const selectedButton = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const optionsId = useId();
  const instructionsId = useId();
  const suggestions = [selected, ...presets[player].filter((emoji) => emoji.symbol !== selected.symbol)].slice(0, 5);
  const options = showAll
    ? [...suggestions, ...emojiLibrary.filter((emoji) => !suggestions.includes(emoji))]
    : suggestions;
  const tabStop = options.some((emoji) => emoji.symbol === focusedSymbol) ? focusedSymbol : selected.symbol;

  useLayoutEffect(() => {
    if (dialog.current?.open) selectedButton.current?.focus();
  }, [showAll]);

  function focusNeighbor(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const grid = event.currentTarget;
    const buttons = Array.from(grid.querySelectorAll("button"));
    const index = buttons.findIndex((button) => button === event.target);
    if (index < 0) return;

    const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    const column = index % columns;
    let next = index;

    switch (event.key) {
      case "ArrowUp": next = index - columns; break;
      case "ArrowDown": next = index + columns; break;
      case "ArrowLeft": next = column > 0 ? index - 1 : index; break;
      case "ArrowRight": next = column < columns - 1 ? index + 1 : index; break;
      case "Home": next = 0; break;
      case "End": next = buttons.length - 1; break;
      default: return;
    }

    event.preventDefault();
    buttons[next]?.focus();
  }

  return (
    <>
      <button
        type="button"
        className={styles["sticker-trigger"]}
        aria-label={`Change sticker for ${name === "You" ? "you" : name}, currently ${selected.name}`}
        aria-haspopup="dialog"
        onClick={() => {
          dialog.current?.showModal();
          selectedButton.current?.focus();
        }}
      >
        <span className={styles["score-sticker"]}>
          <span className={styles.emoji} aria-hidden="true">{selected.symbol}</span>
        </span>
        <span className={styles["sticker-label"]}>Change sticker</span>
      </button>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby={headingId} onClose={() => setShowAll(false)}>
        <div className={styles["picker-heading"]}>
          <h2 id={headingId}>{name === "You" ? "Your sticker" : `${name}’s sticker`}</h2>
          <form method="dialog">
            <button type="submit" className={styles["icon-button"]} aria-label="Close sticker picker">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </form>
        </div>
        {hasMoves && <p>Changing your sticker also updates the marks you’ve placed.</p>}
        <span id={instructionsId} className={styles.visuallyHidden}>Use arrow keys to browse stickers. Press Enter or Space to select one.</span>
        <div
          id={optionsId}
          className={styles["emoji-options"]}
          data-expanded={showAll}
          role="group"
          aria-label={showAll ? "All stickers" : "Suggested stickers"}
          aria-describedby={instructionsId}
          onKeyDown={focusNeighbor}
        >
          {options.map((emoji) => (
            <button
              ref={selected.symbol === emoji.symbol ? selectedButton : undefined}
              type="button"
              key={emoji.symbol}
              className={styles["emoji-option"]}
              aria-label={taken.symbol === emoji.symbol ? `${emoji.name}, chosen by the other player` : emoji.name}
              aria-pressed={selected.symbol === emoji.symbol}
              aria-disabled={taken.symbol === emoji.symbol || undefined}
              tabIndex={tabStop === emoji.symbol ? 0 : -1}
              onFocus={() => setFocusedSymbol(emoji.symbol)}
              onClick={() => {
                if (taken.symbol === emoji.symbol) return;
                onPick(emoji);
                dialog.current?.close();
              }}
            >
              <span className={styles.emoji} aria-hidden="true">{emoji.symbol}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`${styles["quiet-button"]} ${styles["all-stickers"]}`}
          aria-expanded={showAll}
          aria-controls={optionsId}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show fewer" : "All stickers"}
        </button>
      </dialog>
    </>
  );
}
