import { Request, Response } from "express";
import GameSession from "../models/game-session";
import { getSocket } from "../socket-config";

export const createSession = async (req: Request, res: Response) => {
  try {
    const { playerId } = req.body;

    // Check if there's an active game session with just one player
    const activeSession = await GameSession.findOne({
      status: "active",
      "players.player": { $ne: playerId },
    });

    if (activeSession) {
      // Add the player to the existing game session
      await GameSession.findByIdAndUpdate(
        activeSession._id,
        {
          $push: {
            players: {
              player: playerId,
              winsCount: 0,
              drawsCount: 0,
              lossesCount: 0,
            },
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Player added to the existing session." });
    }

    // Create a new game session
    const newGameSession = new GameSession({
      players: [
        { player: playerId, winsCount: 0, drawsCount: 0, lossesCount: 0 },
      ],
    });

    const socket = getSocket();

    socket.join(newGameSession.id);

    await newGameSession.save();
    res.status(201).json(newGameSession);
  } catch (error) {
    res.status(500).json({ error: "Could not create game session" });
  }
};
