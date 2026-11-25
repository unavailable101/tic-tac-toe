"use client";

import { useEffect, useReducer } from "react";
import { toggleTheme } from "../theme";
import { GameBoard } from "./game-board";
import { chooseComputerMove, getResult } from "./game-logic";
import { GameSettings } from "./game-settings";
import { initialGame, updateGame } from "./game-state";
import { Scoreboard } from "./scoreboard";
import styles from "./game.module.css";

const robot = { symbol: "🤖", name: "Robot" };

export default function Game() {
  const [game, dispatch] = useReducer(updateGame, initialGame);
  const { board, difficulty, mode, turn } = game;
  const versusComputer = mode === "computer";
  const result = getResult(board);
  const thinking = versusComputer && turn === "two" && result === null;
  const names = { one: versusComputer ? "You" : "Player 1", two: versusComputer ? "Computer" : "Player 2" };
  const marks = {
    one: versusComputer ? game.computerModePlayerEmoji : game.picks.one,
    two: versusComputer ? robot : game.picks.two,
  };
  const score = game.scores[mode];

  useEffect(() => {
    if (!thinking) return;
    const timer = window.setTimeout(() => {
      const index = chooseComputerMove(board, difficulty);
      if (index !== undefined) dispatch({ type: "move", player: "two", index, boardSnapshot: board });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [board, difficulty, thinking]);

  let status = versusComputer ? "Your turn" : `${names[turn]}’s turn`;
  let statusMark = marks[turn].symbol;
  if (thinking) status = "Computer is thinking…";
  if (result?.winner === "draw") {
    status = "It’s a draw!";
    statusMark = "🤝";
  } else if (result) {
    status = versusComputer && result.winner === "one" ? "You win!" : `${names[result.winner]} wins!`;
    statusMark = marks[result.winner].symbol;
  }

  return (
    <main className={styles["game-shell"]}>
      <header className={styles.hero}>
        <button type="button" className={styles["theme-toggle"]} onClick={toggleTheme}>
          <span className={`${styles.emoji} ${styles["theme-to-dark"]}`} role="img" aria-label="Switch to dark mode">🌙</span>
          <span className={`${styles.emoji} ${styles["theme-to-light"]}`} role="img" aria-label="Switch to light mode">☀️</span>
        </button>
        <div className={styles["game-icon"]} aria-hidden="true">#</div>
        <h1>Tic Tac Toe<span>.</span></h1>
        <p>Pick your emoji and get three in a row.</p>
      </header>

      <div className={styles["game-layout"]}>
        <GameBoard
          board={board}
          result={result}
          thinking={thinking}
          names={names}
          marks={marks}
          status={status}
          statusMark={statusMark}
          onMove={(index) => dispatch({ type: "move", player: turn, index, boardSnapshot: board })}
          onNewRound={() => dispatch({ type: "start-round" })}
        />

        <div className={styles.sidebar}>
          <GameSettings
            mode={mode}
            difficulty={difficulty}
            marks={marks}
            onModeChange={(mode) => dispatch({ type: "mode", mode })}
            onDifficultyChange={(difficulty) => dispatch({ type: "difficulty", difficulty })}
            onEmojiPick={(player, emoji) => dispatch({ type: "emoji", player, emoji })}
          />
          <Scoreboard
            names={names}
            score={score}
            onReset={() => dispatch({ type: "reset-scores" })}
          />
        </div>
      </div>
    </main>
  );
}
