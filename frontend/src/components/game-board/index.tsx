import { FC } from 'react';
import { Player } from '../../pages';
import { Square } from './square';
import { WhoSTurn } from './whos-turn';
import { ScoreRow } from './score-row';

interface GameBoardProp {
  isYourTurn: boolean;
  playerX: boolean;
  squares: Array<string | null>;
  handlePlayer(i: number): void;
  player: Player;
  nextPlayer: Player;
  disabled: boolean;
}

export const GameBoard: FC<GameBoardProp> = ({ player, nextPlayer, ...rest }) => {
  return (
    <div className="board">
      <div className="w-[300px] md:[w-400px] rounded-lg flex flex-col gap-y-4">
        <WhoSTurn name="You" turn={rest.isYourTurn} sign="X" />
        <WhoSTurn name={nextPlayer?.name ?? ''} turn={!rest.isYourTurn} sign="O" />
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="board-row">
          <Square i={0} {...rest} />
          <Square i={1} {...rest} />
          <Square i={2} {...rest} />
        </div>
        <div className="board-row">
          <Square i={3} {...rest} />
          <Square i={4} {...rest} />
          <Square i={5} {...rest} />
        </div>
        <div className="board-row">
          <Square i={6} {...rest} />
          <Square i={7} {...rest} />
          <Square i={8} {...rest} />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-full">
        <ScoreRow name="You" score={player?.wins} />
        <ScoreRow name={nextPlayer?.name ?? ''} score={nextPlayer?.wins} />
        <ScoreRow name="Draws Count" score={player?.draws} />
      </div>
    </div>
  );
};
