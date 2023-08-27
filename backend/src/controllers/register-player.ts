import { Request, Response } from "express";
import Player from "../models/game-player";

export const registerPlayer = async (req: Request, res: Response) => {
  try {
    const { name, gameSessionId } = req.body;

    // Check if a player with the same name already exists in the same game session
    const existingPlayer = await Player.findOne({
      name,
      gameSession: gameSessionId,
    });

    if (existingPlayer) {
      return res
        .status(400)
        .json({
          error:
            "Player with the same name already exists in this game session",
        });
    }

    // Create a new player
    const newPlayer = new Player({ name, gameSession: gameSessionId });

    await newPlayer.save();

    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: "Could not register player" });
  }
};
