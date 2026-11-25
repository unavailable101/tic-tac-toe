export type Player = "one" | "two";
export type Board = (Player | null)[];
export type Difficulty = "Easy" | "Medium" | "Hard";

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function otherPlayer(player: Player): Player {
  return player === "one" ? "two" : "one";
}

export function playMove(board: Board, index: number, player: Player): Board {
  return board.map((cell, position) => position === index ? player : cell);
}

export function getResult(board: Board): { winner: Player | "draw"; line: number[] } | null {
  const line = winningLines.find(([a, b, c]) =>
    board[a] !== null && board[a] === board[b] && board[a] === board[c],
  );
  if (line) return { winner: board[line[0]]!, line };
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

function openCells(board: Board) {
  return board.flatMap((cell, index) => cell === null ? [index] : []);
}

function scorePosition(board: Board, turn: Player, depth: number): number {
  const result = getResult(board);
  if (result) {
    if (result.winner === "draw") return 0;
    return result.winner === "two" ? 10 - depth : depth - 10;
  }

  const scores = openCells(board).map((index) =>
    scorePosition(playMove(board, index, turn), otherPlayer(turn), depth + 1),
  );
  return turn === "two" ? Math.max(...scores) : Math.min(...scores);
}

export function chooseComputerMove(board: Board, difficulty: Difficulty): number | undefined {
  const available = openCells(board);
  if (available.length === 0 || getResult(board)) return;

  if (difficulty === "Hard") {
    const scored = available.map((index) => ({
      index,
      score: scorePosition(playMove(board, index, "two"), "one", 1),
    }));
    return scored.reduce((best, move) => move.score > best.score ? move : best).index;
  }

  if (difficulty === "Medium") {
    for (const player of ["two", "one"] as const) {
      const tacticalMove = available.find((index) =>
        getResult(playMove(board, index, player))?.winner === player,
      );
      if (tacticalMove !== undefined) return tacticalMove;
    }
  }

  return available[Math.floor(Math.random() * available.length)];
}
