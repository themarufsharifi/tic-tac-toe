import { OIcon, XIcon } from '../icons';

export const getSquareValue = (i: number, squares: Array<string | null>) => {
  let value;
  if (squares[i] === 'X') {
    value = <XIcon />;
  } else if (squares[i] === 'O') {
    value = <OIcon />;
  } else {
    value = null;
  }

  return value;
};
