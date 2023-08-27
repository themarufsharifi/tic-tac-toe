import { useState } from "react";
import { GameBoard } from "../components/game-board";

export const GamePage = () => {
  const [isX, setIsX] = useState<boolean>(true);
  const [newGame, setNewGame] = useState<boolean>(false);
  const [squares, setSqaures] = useState<Array<any>>(Array(9).fill(null));

  // handle Choose player
  function handlePlayerX() {
    setIsX(true);
  }

  function handlePlayerO() {
    setIsX(false);
  }

  //// It will Handle which Icon will apppear on Board on cliking  one the Squares
  function handlePlayer(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = isX ? "X" : "O";
    setSqaures(squares);
    setIsX(!isX);
  }

  // It will handle the Restart of the Game

  function handleRestartGame() {
    setIsX(true);
    setSqaures(Array(9).fill(null));
  }

  // It will handle the start Game when the player choose one of the Icon
  // with which they want to player
  function handleNewGame() {
    setIsX(true);
    setSqaures(Array(9).fill(null));
    setNewGame(true);
  }

  function handleQuitGame() {
    setIsX(true);
    setSqaures(Array(9).fill(null));
    setNewGame(false);
  }
  // Calculate the winner
  function calculateWinner(squares: Array<any>) {
    // Total 8 winning patterens
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningPatterns.length; i++) {
      const [a, b, c] = winningPatterns[i];

      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#192a32] py-8 w-full overflow-y-auto justify-center items-start">
      <GameBoard handlePlayer={handlePlayer} playerX={isX} squares={squares} />
    </div>
  );
};
