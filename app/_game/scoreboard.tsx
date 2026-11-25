import { EmojiPicker } from "./emoji-picker";
import type { Emoji } from "./emojis";
import { otherPlayer, type Player, type RoundResult } from "./game-logic";
import type { Score } from "./game-state";
import styles from "./game.module.css";

type ScoreboardProps = {
  names: Record<Player, string>;
  marks: Record<Player, Emoji>;
  score: Score;
  activePlayer: Player | null;
  winner: RoundResult["winner"] | undefined;
  hasMoves: boolean;
  versusComputer: boolean;
  onEmojiPick: (player: Player, emoji: Emoji) => void;
};

export function Scoreboard({ names, marks, score, activePlayer, winner, hasMoves, versusComputer, onEmojiPick }: ScoreboardProps) {
  function playerScore(player: Player) {
    return (
      <div className={styles.player} data-player={player} data-active={activePlayer === player || winner === player} data-scored={winner === player || undefined}>
        {versusComputer && player === "two" ? (
          <span className={`${styles["score-sticker"]} ${styles["robot-sticker"]}`} role="img" aria-label={marks.two.name}>{marks.two.symbol}</span>
        ) : (
          <EmojiPicker
            player={player}
            name={names[player]}
            selected={marks[player]}
            taken={marks[otherPlayer(player)]}
            hasMoves={hasMoves}
            onPick={(emoji) => onEmojiPick(player, emoji)}
          />
        )}
        <span className={styles["player-tally"]}>
          <span>{names[player]}</span>
          <strong>{score[player]}</strong>
        </span>
      </div>
    );
  }

  return (
    <section className={styles.scoreboard} aria-label="Scores">
      {playerScore("one")}
      <div className={styles.draws} data-draw={winner === "draw"}>
        <span>Draws</span>
        <strong>{score.draw}</strong>
      </div>
      {playerScore("two")}
    </section>
  );
}
