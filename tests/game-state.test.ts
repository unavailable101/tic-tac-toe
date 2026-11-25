import assert from "node:assert/strict";
import { test } from "node:test";
import { emojiLibrary } from "../app/_game/emojis";
import { initialGame, updateGame } from "../app/_game/game-state";

type GameState = typeof initialGame;

function move(game: GameState, index: number) {
  return updateGame(game, { type: "move", index, player: game.turn, boardSnapshot: game.board });
}

function finishPlayerOneWin(game: GameState) {
  return [0, 3, 1, 4, 2].reduce(move, game);
}

test("scores a finished round once and ignores occupied or out-of-turn moves", () => {
  const started = move(initialGame, 0);
  assert.equal(started.lastMove, 0);
  assert.equal(move(started, 0), started);
  assert.equal(updateGame(started, {
    type: "move", player: "one", index: 1, boardSnapshot: started.board,
  }), started);
  const finished = finishPlayerOneWin(initialGame);
  assert.equal(finished.lastMove, 2);
  assert.deepEqual(finished.scores.local, { one: 1, two: 0, draw: 0 });
  assert.equal(move(finished, 5), finished);
  const draw = [0, 1, 2, 4, 3, 5, 7, 6, 8].reduce(move, initialGame);
  assert.deepEqual(draw.scores.local, { one: 0, two: 0, draw: 1 });
});

test("tracks scores by mode and resets only the active score without clearing the board", () => {
  const localWin = finishPlayerOneWin(initialGame);
  const computer = updateGame(localWin, { type: "mode", mode: "computer" });
  const computerWin = finishPlayerOneWin(computer);
  assert.equal(computerWin.scores.computer.one, 1);
  assert.equal(computerWin.scores.local.one, 1);

  const reset = updateGame(computerWin, { type: "reset-scores" });
  assert.equal(reset.board, computerWin.board);
  assert.deepEqual(reset.scores.computer, { one: 0, two: 0, draw: 0 });
  assert.equal(reset.scores.local.one, 1);
});

test("a local rematch preserves scores and emoji choices and alternates the starter", () => {
  const emoji = emojiLibrary[10];
  const picked = updateGame(initialGame, { type: "emoji", player: "one", emoji });
  const finished = finishPlayerOneWin(picked);
  const next = updateGame(finished, { type: "start-round" });
  assert.deepEqual(next.board, initialGame.board);
  assert.equal(next.turn, "two");
  assert.equal(next.lastMove, null);
  assert.equal(next.picks.one, emoji);
  assert.equal(next.scores, finished.scores);

  const restarted = updateGame(move(next, 0), { type: "start-round" });
  assert.equal(restarted.turn, "two");
  const draw = [0, 1, 2, 4, 3, 5, 7, 6, 8].reduce(move, restarted);
  assert.equal(draw.scores.local.draw, 1);
  assert.equal(updateGame(draw, { type: "start-round" }).turn, "one");
});

test("a double-line finish scores once and a solo rematch starts with the human", () => {
  const finish = [0, 1, 2, 3, 6, 5, 8, 7, 4];
  const local = finish.reduce(move, initialGame);
  assert.equal(local.scores.local.one, 1);

  const computer = updateGame(initialGame, { type: "mode", mode: "computer" });
  const solo = finish.reduce(move, computer);
  assert.equal(solo.scores.computer.one, 1);
  assert.equal(updateGame(solo, { type: "start-round" }).turn, "one");
});

test("undo restores the active mode’s reset score without discarding subsequent rounds", () => {
  const localWin = finishPlayerOneWin(initialGame);
  const reset = updateGame(localWin, { type: "reset-scores" });
  assert.equal(updateGame(reset, { type: "reset-scores" }), reset);

  const computer = updateGame(reset, { type: "mode", mode: "computer" });
  assert.equal(updateGame(computer, { type: "undo-score-reset" }), computer);

  const local = updateGame(computer, { type: "mode", mode: "local" });
  const nextWin = finishPlayerOneWin(local);
  const restored = updateGame(nextWin, { type: "undo-score-reset" });
  assert.deepEqual(restored.scores.local, { one: 2, two: 0, draw: 0 });
  assert.equal(restored.scores.computer, nextWin.scores.computer);
  assert.equal(restored.board, nextWin.board);
  assert.equal(updateGame(restored, { type: "undo-score-reset" }), restored);
});

test("replacing the board invalidates queued moves, while reselecting a setting preserves the round", () => {
  const computer = updateGame(initialGame, { type: "mode", mode: "computer" });
  const pending = move(computer, 0);
  const queuedMove = {
    type: "move", player: "two", index: 1, boardSnapshot: pending.board,
  } as const;
  // Advance each replacement board to the same turn so the snapshot check decides.
  const replacements = [
    updateGame(pending, { type: "start-round" }),
    updateGame(pending, { type: "difficulty", difficulty: "Hard" }),
    updateGame(pending, { type: "mode", mode: "local" }),
  ];
  for (const replacement of replacements) {
    const next = move(replacement, 0);
    assert.equal(next.turn, "two");
    assert.equal(updateGame(next, queuedMove), next);
  }
  assert.equal(updateGame(pending, { type: "mode", mode: "computer" }), pending);
  assert.equal(updateGame(pending, { type: "difficulty", difficulty: "Medium" }), pending);
});

test("enforces distinct local picks and keeps the computer-mode human pick separate", () => {
  const taken = initialGame.picks.two;
  assert.equal(updateGame(initialGame, { type: "emoji", player: "one", emoji: taken }), initialGame);
  const computer = updateGame(initialGame, { type: "mode", mode: "computer" });
  const picked = updateGame(computer, { type: "emoji", player: "one", emoji: taken });
  assert.equal(picked.computerModePlayerEmoji, taken);
  assert.equal(picked.picks, initialGame.picks);
  assert.equal(updateGame(picked, { type: "emoji", player: "two", emoji: taken }), picked);
});
