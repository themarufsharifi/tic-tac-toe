import { Socket } from "socket.io";
import Round from "../models/game-round";
import GameSession, { GameSessionPlayer } from "../models/game-session";

export const move = async (socket: Socket) => {
  socket.on("move", async (data) => {
    console.log("do something with move: ", data);

    try {
      const {
        roundId,
        playerId,
        sessionId,
        position,
        isCompleted = false,
        isWin = false,
      } = data;

      const round = await Round.findById(roundId);
      let gameSession = null;

      if (round) {
        // Register the move
        round.moves.push({ player: playerId, position });
        const secondPlayerId = round.players.find(
          (player) => player._id.toString() !== playerId
        );
        if ((isCompleted || isWin) && secondPlayerId) {
          gameSession = await GameSession.findById(sessionId);
          if (gameSession) {
            let newPlayers: any[] = [];
            round.currentPlayer = secondPlayerId;
            round.status = "completed";
            if (isWin) {
              round.winner = playerId;
              round.loser = secondPlayerId;
              round.draw = false;

              newPlayers = gameSession.players.map((player) => {
                if (player.player == playerId) {
                  return { ...player, winsCount: player.winsCount + 1 };
                } else {
                  return { ...player, lossesCount: player.lossesCount + 1 };
                }
              });
            } else {
              round.draw = true;
              newPlayers = gameSession.players.map((player) => {
                return { ...player, drawsCount: player.drawsCount + 1 };
              });
            }

            gameSession.players = newPlayers;
          }
        }

        socket.to(sessionId).emit("moved", {
          position,
          turn: true,
          completed: isCompleted,
          winner: isWin ? playerId : null,
        });

        await round.save();
        await gameSession?.save();
      }
    } catch (error) {
      console.log("this error happened when you move: ", error);
    }
  });
};
