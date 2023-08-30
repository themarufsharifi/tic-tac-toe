import { FC } from 'react';

interface WhoSTurnProps {
  name: string;
  turn: boolean;
  sign: string;
}

export const WhoSTurn: FC<WhoSTurnProps> = ({ name, turn, sign }) => {
  return (
    <div className="flex items-center gap-x-2">
      <div className={`px-3 py-1 rounded-md ${turn ? 'bg-[#f3b236]' : 'bg-gray-700'}`}>
        <span className={`text-xl font-bold ${turn ? 'text-white' : 'text-[#30c4bd]'}`}>
          {sign}
        </span>
      </div>
      <h3 className="text-white">{name}</h3>
    </div>
  );
};
