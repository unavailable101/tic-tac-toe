import type { Emoji } from "./emojis";
import { EmojiPicker } from "./emoji-picker";
import { difficulties, type Difficulty, type Player } from "./game-logic";
import type { GameMode } from "./game-state";
import styles from "./game.module.css";

type GameSettingsProps = {
  mode: GameMode;
  difficulty: Difficulty;
  marks: Record<Player, Emoji>;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onEmojiPick: (player: Player, emoji: Emoji) => void;
};

export function GameSettings({
  mode, difficulty, marks, onModeChange, onDifficultyChange, onEmojiPick,
}: GameSettingsProps) {
  const versusComputer = mode === "computer";

  return (
    <section className={`${styles.panel} ${styles.settings}`} aria-labelledby="settings-title">
      <h2 id="settings-title">Game settings</h2>
      <fieldset>
        <legend className={styles["field-label"]}>Game mode</legend>
        <div className={`${styles.segments} ${styles["mode-segments"]}`}>
          <button type="button" aria-pressed={!versusComputer} onClick={() => onModeChange("local")}>
            2 players
          </button>
          <button type="button" aria-pressed={versusComputer} onClick={() => onModeChange("computer")}>
            vs Computer
          </button>
        </div>
      </fieldset>

      {versusComputer && (
        <fieldset>
          <legend className={styles["field-label"]}>Difficulty</legend>
          <div className={`${styles.segments} ${styles["difficulty-segments"]}`}>
            {difficulties.map((level) => (
              <button
                key={level}
                type="button"
                aria-pressed={difficulty === level}
                onClick={() => onDifficultyChange(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <EmojiPicker
        label={versusComputer ? "Your emoji" : "Player 1 emoji"}
        player="one"
        selected={marks.one}
        taken={marks.two}
        onPick={(emoji) => onEmojiPick("one", emoji)}
      />
      {versusComputer ? (
        <div>
          <p className={styles["field-label"]}>Computer emoji</p>
          <div className={styles["computer-emoji"]}>
            <span className={styles.emoji} role="img" aria-label={marks.two.name}>{marks.two.symbol}</span>
          </div>
        </div>
      ) : (
        <EmojiPicker
          label="Player 2 emoji"
          player="two"
          selected={marks.two}
          taken={marks.one}
          onPick={(emoji) => onEmojiPick("two", emoji)}
        />
      )}
    </section>
  );
}
