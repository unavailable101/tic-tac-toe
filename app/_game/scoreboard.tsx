import type { Player } from "./game-logic";
import type { Score } from "./game-state";
import styles from "./game.module.css";

type ScoreboardProps = {
  names: Record<Player, string>;
  score: Score;
  onReset: () => void;
};

export function Scoreboard({ names, score, onReset }: ScoreboardProps) {
  return (
    <section className={`${styles.panel} ${styles.scoreboard}`} aria-labelledby="score-title">
      <div className={styles["score-heading"]}>
        <h2 id="score-title">Scoreboard</h2>
        <button type="button" className={styles["reset-score"]} onClick={onReset}>
          Reset scores
        </button>
      </div>
      <div className={styles["score-grid"]}>
        <div className={`${styles.score} ${styles["score-one"]}`}>
          <span className={styles["score-label"]}>{names.one}</span>
          <strong>{score.one}</strong>
        </div>
        <div className={`${styles.score} ${styles["score-draw"]}`}>
          <span className={styles["score-label"]}>Draws</span>
          <strong>{score.draw}</strong>
        </div>
        <div className={`${styles.score} ${styles["score-two"]}`}>
          <span className={styles["score-label"]}>{names.two}</span>
          <strong>{score.two}</strong>
        </div>
      </div>
    </section>
  );
}
