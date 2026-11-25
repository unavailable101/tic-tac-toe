import { useEffect, useId, useRef, useState, type KeyboardEvent, type Ref } from "react";
import type { Emoji } from "./emojis";
import type { Board, Player, RoundResult } from "./game-logic";
import styles from "./game.module.css";

type GameBoardProps = {
  board: Board;
  result: RoundResult | null;
  thinking: boolean;
  turn: Player;
  lastMove: number | null;
  names: Record<Player, string>;
  marks: Record<Player, Emoji>;
  status: string;
  firstSquare: Ref<HTMLButtonElement>;
  onMove: (index: number) => void;
  onPlayAgain: () => void;
};

export function GameBoard({ board, result, thinking, turn, lastMove, names, marks, status, firstSquare, onMove, onPlayAgain }: GameBoardProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const boardElement = useRef<HTMLDivElement>(null);
  const replayButton = useRef<HTMLButtonElement>(null);
  const instructionsId = useId();
  const statusId = useId();
  const winner = result?.winner;
  const outcome = winner === "draw" ? "draw" : winner ? "win" : undefined;
  const winningSquares = [...new Set(result?.lines.flat())];

  useEffect(() => {
    const focused = document.activeElement;
    if (outcome && focused?.matches(":focus-visible") && boardElement.current?.contains(focused)) {
      replayButton.current?.focus();
    }
  }, [outcome]);

  function focusNeighbor(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const columns = 3;
    const row = Math.floor(focusedIndex / columns);
    const column = focusedIndex % columns;
    let next = focusedIndex;

    switch (event.key) {
      case "ArrowUp": next -= row > 0 ? columns : 0; break;
      case "ArrowDown": next += row < 2 ? columns : 0; break;
      case "ArrowLeft": next -= column > 0 ? 1 : 0; break;
      case "ArrowRight": next += column < 2 ? 1 : 0; break;
      default: return;
    }

    event.preventDefault();
    event.currentTarget.querySelectorAll("button")[next]?.focus();
  }

  return (
    <section aria-label="Game board">
      <div className={styles.turn} data-outcome={outcome} data-player={winner === "draw" ? undefined : winner}>
        <p id={statusId} role="status">{status}</p>
        {result && (
          <button
            ref={replayButton}
            type="button"
            className={styles["play-again"]}
            aria-describedby={statusId}
            onClick={onPlayAgain}
          >
            Play again
          </button>
        )}
      </div>
      <span id={instructionsId} className={styles.visuallyHidden}>Use the arrow keys to move between squares. Press Enter or Space to place your mark.</span>
      <div
        ref={boardElement}
        className={styles.board}
        data-won={outcome === "win" || undefined}
        role="group"
        aria-label="Tic tac toe squares"
        aria-describedby={instructionsId}
        onKeyDown={focusNeighbor}
      >
        {board.map((cell, index) => {
          const winStep = winningSquares.indexOf(index);
          const winning = winStep >= 0;
          const recent = !result && index === lastMove;
          const disabled = cell !== null || result !== null || thinking;
          const position = `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}`;
          return (
            <button
              ref={index === 0 ? firstSquare : undefined}
              type="button"
              key={index}
              className={styles.square}
              data-player={cell ?? undefined}
              data-winning={winning || undefined}
              data-last-move={recent || undefined}
              aria-label={`${position}, ${cell ? `${names[cell]}, ${marks[cell].name}` : "empty"}${winning ? ", winning square" : ""}${recent ? ", last move" : ""}`}
              aria-disabled={disabled}
              tabIndex={focusedIndex === index ? 0 : -1}
              onFocus={() => setFocusedIndex(index)}
              onClick={() => {
                if (!disabled) onMove(index);
              }}
            >
              {cell && (
                <span
                  className={styles.mark}
                  style={winning ? { animationDelay: `${winStep * 45}ms` } : undefined}
                  aria-hidden="true"
                >
                  {marks[cell].symbol}
                </span>
              )}
              {!disabled && (
                <span className={styles.preview} data-player={turn} aria-hidden="true">{marks[turn].symbol}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
