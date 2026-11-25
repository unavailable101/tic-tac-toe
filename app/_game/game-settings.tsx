import { difficulties, type Difficulty } from "./game-logic";
import type { GameMode } from "./game-state";
import styles from "./game.module.css";

type GameSettingsProps = {
  mode: GameMode;
  difficulty: Difficulty;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
};

export function GameSettings({ mode, difficulty, onModeChange, onDifficultyChange }: GameSettingsProps) {
  return (
    <section className={styles.settings} aria-label="Game settings">
      <fieldset className={styles.segments}>
        <legend className={styles.visuallyHidden}>Game mode</legend>
        <button type="button" aria-pressed={mode === "local"} onClick={() => onModeChange("local")}>
          2 players
        </button>
        <button type="button" aria-pressed={mode === "computer"} onClick={() => onModeChange("computer")}>
          vs Computer
        </button>
      </fieldset>

      {mode === "computer" && (
        <fieldset className={`${styles.segments} ${styles.difficulty}`}>
          <legend className={styles.visuallyHidden}>Difficulty</legend>
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
        </fieldset>
      )}
    </section>
  );
}
