"use client";

import { useEffect, useId, useReducer, useRef } from "react";
import {
  chooseComputerMove, getResult, otherPlayer, playMove,
  type Board, type Difficulty, type Player,
} from "./game-logic";

import { emojiLibrary, presets, type Emoji } from "./emojis";
import { toggleTheme } from "./theme";

const robot = { symbol: "🤖", name: "Robot" };
const difficulties = ["Easy", "Medium", "Hard"] as const;

type Mode = "local" | "computer";
type Score = Record<Player | "draw", number>;
type Game = {
  mode: Mode;
  difficulty: Difficulty;
  picks: Record<Player, Emoji>;
  computerPick: Emoji;
  board: Board;
  turn: Player;
  scores: Record<Mode, Score>;
};
type Action =
  | { type: "mode"; mode: Mode }
  | { type: "difficulty"; difficulty: Difficulty }
  | { type: "emoji"; player: Player; emoji: Emoji }
  | { type: "move"; player: Player; index: number; board: Board }
  | { type: "round" }
  | { type: "reset" };

function freshRound() {
  return { board: Array<Player | null>(9).fill(null), turn: "one" as const };
}

function emptyScore(): Score {
  return { one: 0, two: 0, draw: 0 };
}

const initialGame: Game = {
  mode: "local",
  difficulty: "Medium",
  picks: { one: presets.one[0], two: presets.two[0] },
  computerPick: presets.one[0],
  scores: { local: emptyScore(), computer: emptyScore() },
  ...freshRound(),
};

function updateGame(game: Game, action: Action): Game {
  switch (action.type) {
    case "mode":
      return action.mode === game.mode ? game : { ...game, mode: action.mode, ...freshRound() };
    case "difficulty":
      return action.difficulty === game.difficulty
        ? game
        : { ...game, difficulty: action.difficulty, ...freshRound() };
    case "emoji": {
      if (game.mode === "computer") {
        return action.player === "one" ? { ...game, computerPick: action.emoji } : game;
      }
      if (game.picks[otherPlayer(action.player)].symbol === action.emoji.symbol) return game;
      return { ...game, picks: { ...game.picks, [action.player]: action.emoji } };
    }
    case "round":
      return { ...game, ...freshRound() };
    case "reset":
      return { ...game, scores: { ...game.scores, [game.mode]: emptyScore() } };
    case "move": {
      if (game.board !== action.board || game.turn !== action.player ||
          game.board[action.index] !== null || getResult(game.board)) return game;
      const board = playMove(game.board, action.index, action.player);
      const result = getResult(board);
      if (!result) return { ...game, board, turn: otherPlayer(game.turn) };

      const score = game.scores[game.mode];
      return {
        ...game,
        board,
        scores: {
          ...game.scores,
          [game.mode]: { ...score, [result.winner]: score[result.winner] + 1 },
        },
      };
    }
  }
}

function EmojiPicker({ label, player, game, onPick }: {
  label: string;
  player: Player;
  game: Game;
  onPick: (emoji: Emoji) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const selected = game.mode === "computer" ? game.computerPick : game.picks[player];
  const taken = game.mode === "computer" ? robot : game.picks[otherPlayer(player)];
  const shortcuts = presets[player];

  function renderOption(emoji: Emoji, inDialog = false) {
    return (
      <button
        type="button"
        key={emoji.symbol}
        className="emoji-option"
        aria-label={emoji.name}
        aria-pressed={selected.symbol === emoji.symbol}
        disabled={taken.symbol === emoji.symbol}
        onClick={() => {
          onPick(emoji);
          if (inDialog) dialog.current?.close();
        }}
      >
        <span className="emoji" aria-hidden="true">{emoji.symbol}</span>
      </button>
    );
  }

  return (
    <fieldset>
      <legend className="field-label">
        {label}
        {!shortcuts.includes(selected) && (
          <span className="current-emoji emoji" role="img" aria-label={selected.name}>{selected.symbol}</span>
        )}
      </legend>
      <div className="emoji-options">
        {shortcuts.map((emoji) => renderOption(emoji))}
        <button
          type="button"
          className="emoji-option emoji-library-button"
          aria-label="Open emoji library"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          <span className="emoji" aria-hidden="true">🎨</span>
        </button>
      </div>
      <dialog ref={dialog} className="emoji-dialog" aria-labelledby={headingId}>
        <div className="emoji-dialog-heading">
          <h2 id={headingId}>{label}</h2>
          <button type="button" className="dialog-close" aria-label="Close emoji library" onClick={() => dialog.current?.close()}>
            ×
          </button>
        </div>
        <div className="emoji-options">
          {emojiLibrary.filter((emoji) => !shortcuts.includes(emoji)).map((emoji) => renderOption(emoji, true))}
        </div>
      </dialog>
    </fieldset>
  );
}

export default function Game() {
  const [game, dispatch] = useReducer(updateGame, initialGame);
  const { board, difficulty, mode, turn } = game;
  const versusComputer = mode === "computer";
  const result = getResult(board);
  const thinking = versusComputer && turn === "two" && result === null;
  const names = { one: versusComputer ? "You" : "Player 1", two: versusComputer ? "Computer" : "Player 2" };
  const marks = {
    one: versusComputer ? game.computerPick : game.picks.one,
    two: versusComputer ? robot : game.picks.two,
  };
  const score = game.scores[mode];

  useEffect(() => {
    if (!thinking) return;
    const timer = window.setTimeout(() => {
      const index = chooseComputerMove(board, difficulty);
      if (index !== undefined) dispatch({ type: "move", player: "two", index, board });
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
    <main className="game-shell">
      <header className="hero">
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          <span className="emoji theme-to-dark" role="img" aria-label="Switch to dark mode">🌙</span>
          <span className="emoji theme-to-light" role="img" aria-label="Switch to light mode">☀️</span>
        </button>
        <div className="game-icon" aria-hidden="true">#</div>
        <h1>Tic Tac Toe<span>.</span></h1>
        <p>Pick your emoji and get three in a row.</p>
      </header>

      <div className="game-layout">
        <section className="panel play-panel" aria-label="Game board">
          <div className="turn" role="status">
            <span className="emoji" aria-hidden="true">{statusMark}</span>
            {status}
          </div>

          <div className="board" role="group" aria-label="Tic tac toe squares">
            {board.map((cell, index) => {
              const winning = result?.line.includes(index);
              const position = `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}`;
              return (
                <button
                  type="button"
                  key={index}
                  className={`square${winning ? " winning" : ""}`}
                  aria-label={`${position}, ${cell ? `${names[cell]}, ${marks[cell].name}` : "empty"}`}
                  aria-disabled={cell !== null || result !== null || thinking}
                  onClick={() => {
                    if (cell === null && !result && !thinking) {
                      dispatch({ type: "move", player: turn, index, board });
                    }
                  }}
                >
                  {cell && <span className="emoji" aria-hidden="true">{marks[cell].symbol}</span>}
                </button>
              );
            })}
          </div>

          <button type="button" className="new-round" onClick={() => dispatch({ type: "round" })}>
            New round
          </button>
        </section>

        <div className="sidebar">
          <section className="panel settings" aria-labelledby="settings-title">
            <h2 id="settings-title">Game settings</h2>
            <fieldset>
              <legend className="field-label">Game mode</legend>
              <div className="segments mode-segments">
                <button type="button" aria-pressed={!versusComputer} onClick={() => dispatch({ type: "mode", mode: "local" })}>
                  2 players
                </button>
                <button type="button" aria-pressed={versusComputer} onClick={() => dispatch({ type: "mode", mode: "computer" })}>
                  vs Computer
                </button>
              </div>
            </fieldset>

            {versusComputer && (
              <fieldset>
                <legend className="field-label">Difficulty</legend>
                <div className="segments difficulty-segments">
                  {difficulties.map((level) => (
                    <button key={level} type="button" aria-pressed={difficulty === level} onClick={() => dispatch({ type: "difficulty", difficulty: level })}>
                      {level}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <EmojiPicker label={versusComputer ? "Your emoji" : "Player 1 emoji"} player="one" game={game} onPick={(emoji) => dispatch({ type: "emoji", player: "one", emoji })} />
            {versusComputer ? (
              <div>
                <p className="field-label">Computer emoji</p>
                <div className="computer-emoji">
                  <span className="emoji" role="img" aria-label={robot.name}>{robot.symbol}</span>
                </div>
              </div>
            ) : (
              <EmojiPicker label="Player 2 emoji" player="two" game={game} onPick={(emoji) => dispatch({ type: "emoji", player: "two", emoji })} />
            )}
          </section>

          <section className="panel scoreboard" aria-labelledby="score-title">
            <div className="score-heading">
              <h2 id="score-title">Scoreboard</h2>
              <button type="button" className="reset-score" onClick={() => dispatch({ type: "reset" })}>
                Reset scores
              </button>
            </div>
            <div className="score-grid">
              <div className="score score-one">
                <span className="score-label">{names.one}</span>
                <strong>{score.one}</strong>
              </div>
              <div className="score score-draw">
                <span className="score-label">Draws</span>
                <strong>{score.draw}</strong>
              </div>
              <div className="score score-two">
                <span className="score-label">{names.two}</span>
                <strong>{score.two}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
