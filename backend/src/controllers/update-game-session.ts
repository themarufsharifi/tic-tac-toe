import { Request, Response } from "express";
import GameSession from "../models/game-session";

export const updateSession = async (req: Request, res: Response) => {
  try {
    const { sessionId, newStatus } = req.body;

    const session = await GameSession.findByIdAndUpdate(
      sessionId,
      { status: newStatus },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Game session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: "Could not update game session status" });
  }
};
