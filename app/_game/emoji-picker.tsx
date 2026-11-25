import { useId, useRef } from "react";
import { emojiLibrary, presets, type Emoji } from "./emojis";
import type { Player } from "./game-logic";
import styles from "./game.module.css";

type EmojiPickerProps = {
  label: string;
  player: Player;
  selected: Emoji;
  taken: Emoji;
  onPick: (emoji: Emoji) => void;
};

export function EmojiPicker({ label, player, selected, taken, onPick }: EmojiPickerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const shortcuts = presets[player];

  function renderOption(emoji: Emoji, inDialog = false) {
    return (
      <button
        type="button"
        key={emoji.symbol}
        className={styles["emoji-option"]}
        aria-label={emoji.name}
        aria-pressed={selected.symbol === emoji.symbol}
        disabled={taken.symbol === emoji.symbol}
        onClick={() => {
          onPick(emoji);
          if (inDialog) dialog.current?.close();
        }}
      >
        <span className={styles.emoji} aria-hidden="true">{emoji.symbol}</span>
      </button>
    );
  }

  return (
    <fieldset>
      <legend className={styles["field-label"]}>
        {label}
        {!shortcuts.includes(selected) && (
          <span className={`${styles["current-emoji"]} ${styles.emoji}`} role="img" aria-label={selected.name}>{selected.symbol}</span>
        )}
      </legend>
      <div className={styles["emoji-options"]}>
        {shortcuts.map((emoji) => renderOption(emoji))}
        <button
          type="button"
          className={`${styles["emoji-option"]} ${styles["emoji-library-button"]}`}
          aria-label="Open emoji library"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          <span className={styles.emoji} aria-hidden="true">🎨</span>
        </button>
      </div>
      <dialog ref={dialog} className={styles["emoji-dialog"]} aria-labelledby={headingId}>
        <div className={styles["emoji-dialog-heading"]}>
          <h2 id={headingId}>{label}</h2>
          <button type="button" className={styles["dialog-close"]} aria-label="Close emoji library" onClick={() => dialog.current?.close()}>
            ×
          </button>
        </div>
        <div className={styles["emoji-options"]}>
          {emojiLibrary.filter((emoji) => !shortcuts.includes(emoji)).map((emoji) => renderOption(emoji, true))}
        </div>
      </dialog>
    </fieldset>
  );
}
