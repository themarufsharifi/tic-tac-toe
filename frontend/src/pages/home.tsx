import { useEffect } from 'react';
import { HomeContent } from '../components/home-content';
import { Header } from '../components/home-header';
import { socket } from '../config';

export const HomePage = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log(`socket.connected: ${socket.connected}`);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#192a32] flex-col items-center  py-2">
      <div className="board">
        <Header />
        <HomeContent />
      </div>
    </div>
  );
};
