import { FC } from "react";
import { OIcon, XIcon } from "../icons";

interface PlayerProp {
  playerX: boolean;
  squares: Array<any>;
  handlePlayer(i: number): void;
}

interface SquareProp {
  value: JSX.Element | string | null;

  onClick(): void;
}

function Square({ value, onClick }: SquareProp) {
  return (
    <button
      className="square"
      onClick={onClick}
      // disabled={winner ? true : false}
    >
      {value}
    </button>
  );
}

const value = (i: number, squares: Array<any>) => {
  let value;
  if (squares[i] === "X") {
    value = <XIcon />;
  } else if (squares[i] === "O") {
    value = <OIcon />;
  } else {
    value = null;
  }

  return value;
};

interface RenderSquareProps {
  i: number;
  handlePlayer: (i: number) => void;
  squares: Array<any>;
}

const RenderSquare: FC<RenderSquareProps> = ({
  i,
  handlePlayer,

  squares,
}) => {
  return <Square value={value(i, squares)} onClick={() => handlePlayer(i)} />;
};

export const GameBoard: FC<PlayerProp> = ({ playerX, ...rest }) => {
  return (
    <div className="board">
      <div className="w-[300px] md:[w-400px] rounded-lg flex items-center justify-center space-x-10">
        <div className="flex flex-col gap-y-4">
          <div className="text-white bg-gray-700 text-xl px-4 py-1 w-28 rounded-lg font-medium uppercase">
            {playerX ? (
              <span className="text-[#30c4bd] text-2xl font-bold">X</span>
            ) : (
              <span className="text-[#f3b236] text-2xl  font-bold">O</span>
            )}{" "}
            Turn
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="board-row">
          <RenderSquare i={0} {...rest} />
          <RenderSquare i={1} {...rest} />
          <RenderSquare i={2} {...rest} />
        </div>
        <div className="board-row">
          <RenderSquare i={3} {...rest} />
          <RenderSquare i={4} {...rest} />
          <RenderSquare i={5} {...rest} />
        </div>
        <div className="board-row">
          <RenderSquare i={6} {...rest} />
          <RenderSquare i={7} {...rest} />
          <RenderSquare i={8} {...rest} />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-full">
        <div className="text-white bg-gray-700 text-xl p-4 rounded-lg font-medium flex justify-between  w-full">
          <span className="text-[#30c4bd] ">You</span>
          <span className="text-[#f3b236]">4</span>
        </div>
        <div className="text-white bg-gray-700 text-xl p-4 rounded-lg font-medium flex justify-between w-full">
          <div className="text-[#30c4bd] ">player 2</div>
          <div className="text-[#f3b236]">4</div>
        </div>
        <div className="text-white bg-gray-700 text-xl p-4 rounded-lg font-medium flex justify-between w-full">
          <div className="text-[#30c4bd] ">Draw</div>
          <div className="text-[#f3b236]">4</div>
        </div>
      </div>
    </div>
  );
};
