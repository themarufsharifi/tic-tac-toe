import { FC } from 'react';
import { OIcon, XIcon } from '../icons';

interface GameProps {
  isDraw: boolean;
  winner: string;
  handleQuitGame(): void;
  handleNewGame(): void;
}

export const WinnerModal: FC<GameProps> = ({ isDraw, winner, handleQuitGame, handleNewGame }) => {
  return (
    <div className="bg-gray-900/90 z-10 min-h-screen w-full absolute top-0 left-0">
      <div className="w-[calc(100vw-16px)] md:w-[500px] h-[250px] rounded-xl bg-[#1f3540] space-y-10 px-6 py-4 mx-auto mt-52 flex items-center justify-center flex-col">
        <h2 className="flex flex-col items-center justify-center space-y-6 text-2xl md:text-4xl font-bold">
          {isDraw ? (
            <>
              <p className="uppercase text-[#30c4bd]">Draw</p>
              <p className="uppercase text-[#30c4bd]">Takes the Round</p>
            </>
          ) : (
            <>
              {winner === 'X' ? <XIcon /> : <OIcon />}
              <p className="uppercase text-[#30c4bd]">Takes the Round</p>
            </>
          )}
        </h2>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleQuitGame}
            className="button px-4 rounded-md py-1 bg-[#a8bdc8] hover:bg-[#718087] hover:ring-4 hover:ring-gray-400"
          >
            Quit
          </button>
          <button
            onClick={handleNewGame}
            className="button px-4 rounded-md py-1 bg-[#f3b236] hover:bg-[#30c4bd] hover:ring-4 hover:ring-cyan-300"
          >
            Next Round
          </button>
        </div>
      </div>
    </div>
  );
};
