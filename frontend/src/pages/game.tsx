import { useEffect, useRef, useState } from 'react';
import { GameBoard, WinnerModal } from '../components';
import { useLocation, useNavigate } from 'react-router-dom';
import { axios, socket } from '../config';
import { calculateWinnerOrCompleted } from '../utils/calculate-winner-completed';
import { EVENTS } from '../constants';

export enum SIGN {
  X = 'X',
  O = 'O'
}

export type Player = {
  id?: string;
  name?: string;
  wins?: number;
  draws?: number;
};

const sign = SIGN.X;

export const GamePage = () => {
  const { state } = useLocation();
  const sessionId = state?.sessionId;
  const playerId = state?.playerId;
  const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
  const [{ you, nextPlayer }, setPlayers] = useState<{
    you: Player;
    nextPlayer: Player;
  }>({
    you: {},
    nextPlayer: {}
  });
  const [winner, setWinner] = useState<string>('');
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const isFirstRound = useRef(true);
  const [roundId, setRoundId] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
  const isInterrupt = useRef(false);
  const [disable, setDisable] = useState(false);

  const navigate = useNavigate();

  const getSession = async () => {
    try {
      const { data } = await axios.get('/session', {
        params: {
          id: sessionId
        }
      });
      const players = data?.players;
      let newPlayers = { you: {}, nextPlayer: {} };

      for (let index = 0; index < players?.length; index++) {
        const sessionPlayerData = players[index];
        const player = sessionPlayerData?.player;

        if (playerId === player?._id) {
          newPlayers = {
            ...newPlayers,
            you: {
              id: player._id,
              name: 'You',
              wins: sessionPlayerData?.winsCount,
              draws: sessionPlayerData?.drawsCount
            }
          };
        } else {
          newPlayers = {
            ...newPlayers,
            nextPlayer: {
              id: player._id,
              name: player?.name,
              wins: sessionPlayerData?.winsCount,
              draws: sessionPlayerData?.drawsCount
            }
          };
        }
      }

      setPlayers(newPlayers);
    } catch (error) {
      console.log('error in catch getSession: ', error);
    }
  };

  const createRound = async (isNewRound?: boolean) => {
    const { data } = await axios.post('/create-round', {
      gameSessionId: sessionId
    });

    setRoundId(data?._id);
    if (data?.isSecondPlayer) {
      if (isNewRound) {
        socket.emit(EVENTS.NEW_ROUND, sessionId);
        setDisable(false);
      } else {
        socket.emit(EVENTS.GAME_START, sessionId);
      }
      setIsGameStarted(true);
    }
  };

  useEffect(() => {
    if (!isFirstRound.current) return;
    isFirstRound.current = false;
    getSession();
    createRound();
  }, []);

  const handlePlayer = (i: number) => {
    if (squares[i] || !isYourTurn) {
      return;
    }

    squares[i] = SIGN.X;
    setSquares([...squares]);
    setIsYourTurn(false);

    const result = calculateWinnerOrCompleted(squares);
    const isCompleted = result?.isCompleted;
    const winner = result?.winner;

    if (winner) {
      setWinner(winner);
      setDisable(true);
    } else if (isCompleted) {
      setIsGameCompleted(true);
      setDisable(true);
    }

    socket.emit(EVENTS.MOVE_SEND, {
      position: i,
      sessionId: sessionId,
      roundId,
      playerId: playerId,
      isCompleted,
      isWin: !!winner
    });
  };

  function handleNewRound() {
    setSquares(Array(9).fill(null));
    setWinner('');
    setIsGameCompleted(false);
    getSession();
    createRound(true);
  }

  async function handleQuitGame() {
    socket.emit(EVENTS.FINISH_GAME, sessionId);
    try {
      await axios.put('/update-session', {
        sessionId,
        status: 'completed'
      });
      isInterrupt.current = false;

      navigate(-1);
    } catch (error) {
      console.log('error in catch of handle quite: ', error);
    }
  }

  useEffect(() => {
    socket.on(EVENTS.MOVE_RECEIVE, (data) => {
      const position = data?.position;
      const nextPlayerSign = sign === SIGN.X ? SIGN.O : SIGN.X;
      setSquares((squares) => {
        squares[position] = nextPlayerSign;

        return [...squares];
      });

      if (data?.winner) {
        setWinner(nextPlayerSign);
        setDisable(true);
      } else if (data?.completed) {
        setIsGameCompleted(true);
        setDisable(true);
      }
      setIsYourTurn(true);
    });
    return () => {
      socket.off(EVENTS.MOVE_RECEIVE);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      isInterrupt.current = true;
    }, 500);

    socket.on(EVENTS.GAME_STARTED, () => {
      setIsGameStarted(true);
      setIsYourTurn(true);
      getSession();
    });

    socket.on(EVENTS.NEW_ROUND_STARTED, () => {
      setIsGameStarted(true);
      setDisable(false);
      getSession();
    });

    socket.on(EVENTS.GAME_FINISHED, () => {
      navigate(-1);
    });
    socket.on(EVENTS.GAME_INTERRUPTED, () => {
      navigate(-1);
    });

    return () => {
      socket.off(EVENTS.GAME_STARTED);
      socket.off(EVENTS.NEW_ROUND_STARTED);
      socket.off(EVENTS.GAME_FINISHED);
      socket.off(EVENTS.GAME_INTERRUPTED);
      if (isInterrupt.current) {
        socket.emit(EVENTS.GAME_INTERRUPT, {
          sessionId,
          playerId
        });
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#192a32] py-8 w-full overflow-y-auto justify-center items-start">
      {isGameStarted ? (
        <GameBoard
          disabled={disable}
          isYourTurn={isYourTurn}
          player={you}
          nextPlayer={nextPlayer}
          handlePlayer={handlePlayer}
          playerX={sign === SIGN.X && isYourTurn ? true : false}
          squares={squares}
        />
      ) : (
        <div className="uppercase text-[#f3b236] font-medium text-xl">
          Waiting for next player to join...
        </div>
      )}
      {(winner || isGameCompleted) && (
        <WinnerModal
          isDraw={isGameCompleted}
          winner={winner}
          handleNewGame={handleNewRound}
          handleQuitGame={handleQuitGame}
        />
      )}
    </div>
  );
};
