import { useCallback, useState } from "react";

export const HomePage = () => {
  const [name, setName] = useState("");

  const _handleStartGame = useCallback(() => {
    console.log("game is starting");
  }, []);

  const _handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="flex min-h-screen bg-[#192a32] flex-col items-center  py-2">
      <div className="board">
        <h1 className="text-4xl md:text-6xl font-extrabold mt-4 text-[#30c4bd]">
          Tic <span className="text-[#f3b236]">Tac </span> Toe
        </h1>
        <input
          value={name}
          onChange={_handleChangeName}
          maxLength={40}
          className="border-[#f3b236] hover:border-[#30c4bd] focus:border-[#30c4bd] border-[2px] w-full rounded-lg px-4 py-2 outline-none font-medium"
          placeholder="Enter your name"
        />
        <button
          onClick={_handleStartGame}
          className="button px-4 rounded-md py-1 bg-[#f3b236] hover:bg-[#30c4bd] hover:ring-4 hover:ring-cyan-300"
        >
          Start Game
        </button>

        <div className="w-full flex flex-col gap-y-4">
          {[1, 2, 3, 4, 5, 6].map((count) => {
            return (
              <div
                className="text-white bg-gray-700 text-xl p-4 rounded-lg font-medium flex flex-col justify-between w-full"
                key={count}
              >
                <div className="flex justify-between items-center">
                  <div className="w-[50%]">W: AhmadAhmad</div>
                  <div className="w-[20%]">R: 43</div>
                  <div className="w-[20%]">D: 20</div>
                </div>
                <div className="flex text-green-700 justify-between items-center">
                  <div className="w-[50%]">Ahmad</div>
                  <div className="w-[20%]">win: 13</div>
                  <div className="w-[20%]">lose: 10</div>
                </div>
                <div className="flex text-red-400 justify-between items-center">
                  <div className="w-[50%]">moh</div>
                  <div className="w-[20%]">win: 10</div>
                  <div className="w-[20%]">lose: 13</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
