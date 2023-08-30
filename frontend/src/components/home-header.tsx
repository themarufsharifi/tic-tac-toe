import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axios, socket } from '../config';
import { EVENTS, PLYER_ID } from '../constants';

export const Header = () => {
  const [name, setName] = useState('');
  const [playerId, setPlayerId] = useState(() => localStorage.getItem(PLYER_ID));
  const navigate = useNavigate();
  const firstRender = useRef(true);

  const _handleCreateSession = async (_playerId: string) => {
    try {
      const { data } = await axios.post('/create-session', {
        playerId: _playerId
      });
      const sessionId = data?._id;

      socket.emit(EVENTS.JOIN, sessionId);

      navigate('/game', {
        state: {
          sessionId,
          playerId: _playerId
        }
      });
    } catch (error) {
      console.log('register-player in catch ', error);
    }
  };

  const _handleStartGame = async () => {
    if (playerId) {
      await _handleCreateSession(playerId);
    } else {
      try {
        const { data } = await axios.post('/register-player', {
          name
        });

        const id = data?._id;
        localStorage.setItem(PLYER_ID, id);
        setPlayerId(id);

        await _handleCreateSession(id);
      } catch (error) {
        console.log('register-player in catch ', error);
      }
    }
  };

  const getPlayer = async () => {
    if (firstRender.current) firstRender.current = false;
    try {
      const { data } = await axios.get('/player', {
        params: {
          id: playerId
        }
      });

      setName(data?.name);
    } catch (error) {
      console.log('player in catch ', error);
    }
  };

  useEffect(() => {
    if (playerId) {
      getPlayer();
    }
  }, []);

  const _handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <>
      <h1 className="text-4xl md:text-6xl font-extrabold mt-4 text-[#30c4bd]">
        Tic <span className="text-[#f3b236]">Tac </span> Toe
      </h1>
      <input
        value={name}
        onChange={_handleChangeName}
        disabled={Boolean(playerId)}
        maxLength={40}
        className={`${
          playerId
            ? 'border-gray-600'
            : 'border-[#f3b236] hover:border-[#30c4bd] focus:border-[#30c4bd]'
        } border-[2px] w-full rounded-lg px-4 py-2 outline-none font-medium`}
        placeholder="Enter your name"
      />
      <button
        onClick={_handleStartGame}
        className="button px-4 rounded-md py-1 bg-[#f3b236] hover:bg-[#30c4bd] hover:ring-4 hover:ring-cyan-300"
      >
        Start Game
      </button>
    </>
  );
};
