import { FC } from 'react';
import { getSquareValue } from '../../utils/get-square-value';

interface SquareProps {
  isYourTurn: boolean;
  i: number;
  handlePlayer: (i: number) => void;
  squares: Array<string | null>;
  disabled: boolean;
}

export const Square: FC<SquareProps> = ({ i, handlePlayer, squares, isYourTurn, disabled }) => {
  const value = getSquareValue(i, squares);

  return (
    <button
      className={`square ${
        value || !isYourTurn || disabled
          ? 'cursor-auto'
          : 'active:scale-125 transition duration-200 ease-in hover:bg-[#18272e] cursor-pointer'
      }`}
      onClick={() => handlePlayer(i)}
      disabled={!!value || disabled}
    >
      {value}
    </button>
  );
};
