import { FC } from 'react';

interface ScoreRowProps {
  name: string;
  score?: number;
}

export const ScoreRow: FC<ScoreRowProps> = ({ name, score = 0 }) => {
  return (
    <>
      <div className="text-white bg-gray-700 text-xl p-4 rounded-lg font-medium flex justify-between  w-full">
        <span className="text-[#30c4bd] ">{name}</span>
        <span className="text-[#f3b236]">{score}</span>
      </div>
    </>
  );
};
