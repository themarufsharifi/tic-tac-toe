import { Request, Response } from "express";
import Round from "../models/game-round";

export const createRound = async (req: Request, res: Response) => {
  try {
    const { gameSessionId } = req.body;

    // Check if there's a round in the game session with 'pending' status
    const pendingRound = await Round.findOne({
      gameSession: gameSessionId,
      status: "pending",
    });

    if (pendingRound) {
      // Change the status of the existing round to 'in-progress'
      await Round.findByIdAndUpdate(pendingRound._id, {
        status: "in-progress",
      });
      return res
        .status(200)
        .json({ message: "Round status changed to in-progress." });
    }

    // Create a new round with 'pending' status
    const newRound = new Round({
      gameSession: gameSessionId,
      status: "pending",
    });

    await newRound.save();
    res.status(201).json(newRound);
  } catch (error) {
    res.status(500).json({ error: "Could not create round" });
  }
};
