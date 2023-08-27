import { Request, Response } from "express";
import GameSession from "../models/game-session";

export const getGameList = async (req: Request, res: Response) => {
  try {
    const gameSessions = await GameSession.find();

    res.status(200).json(gameSessions);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch game sessions" });
  }
};
