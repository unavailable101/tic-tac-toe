import type { Emoji } from "./emojis";
import type { Board, Player, RoundResult } from "./game-logic";
import styles from "./game.module.css";

type GameBoardProps = {
  board: Board;
  result: RoundResult | null;
  thinking: boolean;
  names: Record<Player, string>;
  marks: Record<Player, Emoji>;
  status: string;
  statusMark: string;
  onMove: (index: number) => void;
  onNewRound: () => void;
};

export function GameBoard({
  board, result, thinking, names, marks, status, statusMark, onMove, onNewRound,
}: GameBoardProps) {
  return (
    <section className={`${styles.panel} ${styles["play-panel"]}`} aria-label="Game board">
      <div className={styles.turn} role="status">
        <span className={styles.emoji} aria-hidden="true">{statusMark}</span>
        {status}
      </div>

      <div className={styles.board} role="group" aria-label="Tic tac toe squares">
        {board.map((cell, index) => {
          const winning = result?.line.includes(index);
          const disabled = cell !== null || result !== null || thinking;
          const position = `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}`;
          return (
            <button
              type="button"
              key={index}
              className={winning ? `${styles.square} ${styles.winning}` : styles.square}
              aria-label={`${position}, ${cell ? `${names[cell]}, ${marks[cell].name}` : "empty"}`}
              aria-disabled={disabled}
              onClick={() => {
                if (!disabled) onMove(index);
              }}
            >
              {cell && <span className={styles.emoji} aria-hidden="true">{marks[cell].symbol}</span>}
            </button>
          );
        })}
      </div>

      <button type="button" className={styles["new-round"]} onClick={onNewRound}>
        New round
      </button>
    </section>
  );
}
