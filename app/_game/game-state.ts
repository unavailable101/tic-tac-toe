import { presets, type Emoji } from "./emojis";
import { getResult, otherPlayer, playMove, type Board, type Difficulty, type Player } from "./game-logic";

export type GameMode = "local" | "computer";
export type Score = Record<Player | "draw", number>;
type GameState = {
  mode: GameMode;
  difficulty: Difficulty;
  picks: Record<Player, Emoji>;
  computerModePlayerEmoji: Emoji;
  board: Board;
  starter: Player;
  turn: Player;
  lastMove: number | null;
  scores: Record<GameMode, Score>;
  resetSnapshot: Partial<Record<GameMode, Score>>;
};
type GameAction =
  | { type: "mode"; mode: GameMode }
  | { type: "difficulty"; difficulty: Difficulty }
  | { type: "emoji"; player: Player; emoji: Emoji }
  | { type: "move"; player: Player; index: number; boardSnapshot: Board }
  | { type: "start-round" }
  | { type: "reset-scores" }
  | { type: "undo-score-reset" };

function freshRound(starter: Player = "one") {
  return { board: Array<Player | null>(9).fill(null), starter, turn: starter, lastMove: null };
}

function emptyScore(): Score {
  return { one: 0, two: 0, draw: 0 };
}

export const initialGame: GameState = {
  mode: "local",
  difficulty: "Medium",
  picks: { one: presets.one[0], two: presets.two[0] },
  computerModePlayerEmoji: presets.one[0],
  scores: { local: emptyScore(), computer: emptyScore() },
  resetSnapshot: {},
  ...freshRound(),
};

export function updateGame(game: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "mode":
      return action.mode === game.mode ? game : { ...game, mode: action.mode, ...freshRound() };
    case "difficulty":
      return action.difficulty === game.difficulty
        ? game
        : { ...game, difficulty: action.difficulty, ...freshRound() };
    case "emoji": {
      if (game.mode === "computer") {
        return action.player === "one" ? { ...game, computerModePlayerEmoji: action.emoji } : game;
      }
      if (game.picks[otherPlayer(action.player)].symbol === action.emoji.symbol) return game;
      return { ...game, picks: { ...game.picks, [action.player]: action.emoji } };
    }
    case "start-round": {
      const rematch = game.mode === "local" && getResult(game.board);
      return { ...game, ...freshRound(rematch ? otherPlayer(game.starter) : game.starter) };
    }
    case "reset-scores": {
      const score = game.scores[game.mode];
      if (score.one + score.two + score.draw === 0) return game;
      return {
        ...game,
        scores: { ...game.scores, [game.mode]: emptyScore() },
        resetSnapshot: { ...game.resetSnapshot, [game.mode]: score },
      };
    }
    case "undo-score-reset": {
      const previous = game.resetSnapshot[game.mode];
      if (!previous) return game;
      const score = game.scores[game.mode];
      const restored = { one: previous.one + score.one, two: previous.two + score.two, draw: previous.draw + score.draw };
      return {
        ...game,
        scores: { ...game.scores, [game.mode]: restored },
        resetSnapshot: { ...game.resetSnapshot, [game.mode]: undefined },
      };
    }
    case "move": {
      // A scheduled computer move may belong to a board that has since been replaced.
      if (
        game.board !== action.boardSnapshot ||
        game.turn !== action.player ||
        game.board[action.index] !== null ||
        getResult(game.board)
      ) {
        return game;
      }

      const board = playMove(game.board, action.index, action.player);
      const result = getResult(board);
      if (!result) return { ...game, board, lastMove: action.index, turn: otherPlayer(game.turn) };

      const score = game.scores[game.mode];
      return {
        ...game,
        board,
        lastMove: action.index,
        scores: {
          ...game.scores,
          [game.mode]: { ...score, [result.winner]: score[result.winner] + 1 },
        },
      };
    }
  }
}
