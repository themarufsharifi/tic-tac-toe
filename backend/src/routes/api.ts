import { Router } from "express";
import {
  createSession,
  registerPlayer,
  createRound,
  updateSession,
  getGameList,
} from "../controllers";

const router = Router();

// Start a new game
router.post("/register-player", registerPlayer);
router.post("/create-session", createSession);
router.post("/create-round", createRound);
router.put("/update-session", updateSession);

// Get a list of game sessions
router.get("/games", getGameList);

export default router;
