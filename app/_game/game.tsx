"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { toggleTheme } from "../theme";
import { GameBoard } from "./game-board";
import { chooseComputerMove, getResult } from "./game-logic";
import { GameSettings } from "./game-settings";
import { initialGame, updateGame } from "./game-state";
import { Scoreboard } from "./scoreboard";
import styles from "./game.module.css";

const robot = { symbol: "🤖", name: "Robot" };
type RoundChange = Extract<Parameters<typeof updateGame>[1], { type: "mode" | "difficulty" | "start-round" }>;

const confirmation = {
  mode: { title: "Switch mode and restart?", action: "Switch mode" },
  difficulty: { title: "Change difficulty and restart?", action: "Change difficulty" },
  "start-round": { title: "Restart this round?", action: "Restart round" },
};

export default function Game() {
  const [game, dispatch] = useReducer(updateGame, initialGame);
  const [pending, setPending] = useState<RoundChange | null>(null);
  const [scoreFeedback, setScoreFeedback] = useState("");
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const firstSquare = useRef<HTMLButtonElement>(null);
  const resetScores = useRef<HTMLButtonElement>(null);
  const { board, difficulty, lastMove, mode, turn } = game;
  const versusComputer = mode === "computer";
  const result = getResult(board);
  const thinking = versusComputer && turn === "two" && result === null;
  const activeRound = result === null && lastMove !== null;
  const names = { one: versusComputer ? "You" : "Player 1", two: versusComputer ? "Computer" : "Player 2" };
  const marks = {
    one: versusComputer ? game.computerModePlayerEmoji : game.picks.one,
    two: versusComputer ? robot : game.picks.two,
  };
  const score = game.scores[mode];
  const hasScores = score.one + score.two + score.draw > 0;
  const canUndo = Boolean(game.resetSnapshot[mode]);
  const dialogCopy = pending && confirmation[pending.type];

  useEffect(() => {
    if (!thinking) return;
    const timer = window.setTimeout(() => {
      const index = chooseComputerMove(board, difficulty);
      if (index !== undefined) dispatch({ type: "move", player: "two", index, boardSnapshot: board });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [board, difficulty, thinking]);

  useEffect(() => {
    if (pending) confirmDialog.current?.showModal();
  }, [pending]);

  function applyRoundChange(action: RoundChange) {
    dispatch(action);
    if (action.type === "mode") setScoreFeedback("");
    if (action.type === "start-round") firstSquare.current?.focus();
  }

  function requestRoundChange(action: RoundChange) {
    if (activeRound) {
      setPending(action);
      return;
    }
    applyRoundChange(action);
  }

  let status = versusComputer ? "Your turn" : `${names[turn]}’s turn`;
  if (lastMove === null) status += " · Pick a square";
  if (thinking) status = "Computer is thinking…";
  if (result?.winner === "draw") {
    status = "It’s a draw!";
  } else if (result) {
    status = versusComputer && result.winner === "one" ? "You win!" : `${names[result.winner]} wins!`;
    if (result.lines.length > 1) status += " Two lines!";
  }

  return (
    <main className={styles.game}>
      <header className={styles.masthead}>
        <h1>Tic Tac Toe</h1>
        <button type="button" className={styles["icon-button"]} onClick={toggleTheme}>
          <svg className={styles["theme-to-dark"]} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1 9 9 0 1 0 20.9 13.3Z" />
          </svg>
          <span className={styles["theme-to-dark"]}>Dark<span className={styles.visuallyHidden}> mode</span></span>
          <svg className={styles["theme-to-light"]} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </svg>
          <span className={styles["theme-to-light"]}>Light<span className={styles.visuallyHidden}> mode</span></span>
        </button>
      </header>

      <GameSettings
        mode={mode}
        difficulty={difficulty}
        onModeChange={(nextMode) => {
          if (nextMode !== mode) requestRoundChange({ type: "mode", mode: nextMode });
        }}
        onDifficultyChange={(level) => {
          if (level !== difficulty) requestRoundChange({ type: "difficulty", difficulty: level });
        }}
      />

      <Scoreboard
        names={names}
        marks={marks}
        score={score}
        activePlayer={result ? null : turn}
        winner={result?.winner}
        hasMoves={lastMove !== null}
        versusComputer={versusComputer}
        onEmojiPick={(player, emoji) => dispatch({ type: "emoji", player, emoji })}
      />

      <GameBoard
        board={board}
        result={result}
        thinking={thinking}
        turn={turn}
        lastMove={lastMove}
        names={names}
        marks={marks}
        status={status}
        firstSquare={firstSquare}
        onMove={(index) => dispatch({ type: "move", player: turn, index, boardSnapshot: board })}
        onPlayAgain={() => applyRoundChange({ type: "start-round" })}
      />

      <div className={styles.actions}>
        <div className={styles["score-actions"]}>
          <button
            ref={resetScores}
            type="button"
            className={styles["quiet-button"]}
            aria-disabled={!hasScores}
            onClick={() => {
              if (!hasScores) return;
              dispatch({ type: "reset-scores" });
              setScoreFeedback("Scores reset.");
            }}
          >
            Reset scores
          </button>
          {canUndo && (
            <button
              type="button"
              className={styles["quiet-button"]}
              aria-label="Undo score reset"
              onClick={() => {
                dispatch({ type: "undo-score-reset" });
                setScoreFeedback("Scores restored.");
                resetScores.current?.focus();
              }}
            >
              Undo
            </button>
          )}
        </div>
        <span className={styles.visuallyHidden} role="status">{scoreFeedback}</span>
        {activeRound && (
          <button
            type="button"
            className={styles["quiet-button"]}
            onClick={() => requestRoundChange({ type: "start-round" })}
          >
            Restart round
          </button>
        )}
      </div>

      <dialog
        ref={confirmDialog}
        className={styles.dialog}
        aria-labelledby="round-confirm-title"
        aria-describedby="round-confirm-description"
        onClose={() => setPending(null)}
      >
        <h2 id="round-confirm-title">{dialogCopy?.title}</h2>
        <p id="round-confirm-description">The moves in this round will be cleared. Your scores will be kept.</p>
        <form method="dialog" className={styles["dialog-actions"]}>
          <button className={styles["quiet-button"]}>Keep playing</button>
          <button
            type="button"
            className={styles["play-again"]}
            onClick={() => {
              confirmDialog.current?.close();
              if (pending) applyRoundChange(pending);
            }}
          >
            {dialogCopy?.action}
          </button>
        </form>
      </dialog>
    </main>
  );
}
