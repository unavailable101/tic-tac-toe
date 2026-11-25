import assert from "node:assert/strict";
import { test } from "node:test";
import { chooseComputerMove, difficulties, getResult, playMove, type Board } from "../app/_game/game-logic";

const emptyBoard = (): Board => Array(9).fill(null);

test("reports each winning line, a draw, and an unfinished board", () => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of lines) {
    const board = line.reduce((board, index) => playMove(board, index, "one"), emptyBoard());
    assert.deepEqual(getResult(board), { winner: "one", lines: [line] });
  }
  assert.deepEqual(getResult([
    "one", "two", "one", "one", "two", "two", "two", "one", "one",
  ]), { winner: "draw", lines: [] });
  assert.equal(getResult(emptyBoard()), null);
});

test("returns both lines when one move completes two diagonals", () => {
  assert.deepEqual(getResult([
    "one", "two", "one", "two", "one", "two", "one", "two", "one",
  ]), { winner: "one", lines: [[0, 4, 8], [2, 4, 6]] });
});

test("all difficulties leave finished boards alone", () => {
  const won: Board = ["one", "one", "one", null, "two", null, "two", null, null];
  const drawn: Board = ["one", "two", "one", "one", "two", "two", "two", "one", "one"];
  for (const difficulty of difficulties) {
    assert.equal(chooseComputerMove(won, difficulty), undefined);
    assert.equal(chooseComputerMove(drawn, difficulty), undefined);
  }
});

test("Easy chooses an open square", () => {
  const board: Board = ["one", "two", null, "two", "one", null, "one", null, "two"];
  const move = chooseComputerMove(board, "Easy");
  assert.ok(move !== undefined && [2, 5, 7].includes(move));
});

test("Medium takes an immediate win before blocking and blocks when it cannot win", () => {
  assert.equal(chooseComputerMove([
    "one", "one", null, "two", "two", null, null, null, "one",
  ], "Medium"), 5);
  assert.equal(chooseComputerMove([
    "one", "one", null, null, "two", null, null, null, null,
  ], "Medium"), 2);
});

test("Hard uses the first equally good move and never loses from the initial board", () => {
  assert.equal(chooseComputerMove(playMove(emptyBoard(), 4, "one"), "Hard"), 0);

  function checkHumanReplies(board: Board) {
    for (const [index, cell] of board.entries()) {
      if (cell !== null) continue;
      const afterHuman = playMove(board, index, "one");
      const result = getResult(afterHuman);
      assert.notEqual(result?.winner, "one");
      if (result) continue;

      const reply = chooseComputerMove(afterHuman, "Hard");
      assert.ok(reply !== undefined);
      assert.equal(afterHuman[reply], null);
      const afterComputer = playMove(afterHuman, reply, "two");
      if (!getResult(afterComputer)) checkHumanReplies(afterComputer);
    }
  }

  checkHumanReplies(emptyBoard());
});
