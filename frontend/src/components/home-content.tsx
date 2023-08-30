import { FC, useEffect, useState } from 'react';
import { axios } from '../config';

export const HomeContent = () => {
  const [sessions, setSessions] = useState([]);

  const getSessions = async () => {
    try {
      const { data } = await axios.get('/sessions');

      setSessions(data);
    } catch (error) {
      console.log('catch error in: ', error);
    }
  };

  useEffect(() => {
    getSessions();
  }, []);

  return (
    <div className="w-full flex flex-col gap-y-4">
      {sessions?.map((session: any) => {
        const players = session?.players;

        const p1 = players?.[0];
        const p2 = players?.[1];
        const p1Wins = p1?.winsCount;
        const p2Wins = p2?.winsCount;
        const p1Name = p1?.player?.name;
        const p2Name = p2?.player?.name;
        const p1Loses = p1?.lossesCount;
        const p1Draws = p1?.drawsCount;
        const p2Loses = p2?.lossesCount;

        const hasWinner = p1Wins === p2Wins ? false : true;
        let winner;
        let loser;
        if (hasWinner) {
          if (p1Wins > p2Wins) {
            winner = { name: p1Name, loses: p1Loses, wins: p1Wins };
            loser = { name: p2Name, loses: p2Loses, wins: p2Wins };
          } else {
            winner = { name: p2Name, loses: p2Loses, wins: p2Wins };
            loser = { name: p1Name, loses: p1Loses, wins: p1Wins };
          }
        }

        const roundsCount = p1Wins + p1Loses + p1Draws;

        return (
          <div
            className="text-white bg-gray-700 text-xl p-4 rounded-lg font-medium flex flex-col justify-between w-full"
            key={session?._id}
          >
            <SessionRow
              name={hasWinner ? `W: ${winner?.name}` : 'No Winner'}
              losesCount={`D: ${p1Draws}`}
              winsCount={`R: ${roundsCount}`}
            />
            <SessionRow
              name={hasWinner ? winner?.name : p1Name}
              losesCount={`lose: ${hasWinner ? winner?.loses : p1Loses}`}
              winsCount={`win: ${hasWinner ? winner?.wins : p1Wins}`}
              color={hasWinner ? 'Green' : undefined}
            />
            <SessionRow
              name={hasWinner ? loser?.name : p2Name}
              losesCount={`lose: ${hasWinner ? loser?.loses : p2Loses}`}
              winsCount={`win: ${hasWinner ? loser?.wins : p2Wins}`}
              color={hasWinner ? 'Red' : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};

interface SessionRowProps {
  name: string;
  winsCount: string;
  losesCount: string;
  color?: string;
}

const SessionRow: FC<SessionRowProps> = ({ name, winsCount, losesCount, color }) => {
  return (
    <div
      className={`flex justify-between items-center ${
        !color ? 'text-white' : color === 'Red' ? 'text-red-400' : 'text-green-700'
      }`}
    >
      <div className="w-[50%]">{name}</div>
      <div className="w-[20%]">{winsCount}</div>
      <div className="w-[20%]">{losesCount}</div>
    </div>
  );
};
