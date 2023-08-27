import { Document, Schema, Types, model } from "mongoose";

export interface GameSessionPlayer extends Document {
  player: Types.ObjectId;
  winsCount: number;
  drawsCount: number;
  lossesCount: number;
}

export interface IGameSession extends Document {
  players: GameSessionPlayer[];
  rounds: Types.ObjectId[];
  status: "active" | "completed";
}

const gameSession = new Schema<IGameSession>({
  players: [
    {
      player: {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
      winsCount: {
        type: Number,
        default: 0,
      },
      drawsCount: {
        type: Number,
        default: 0,
      },
      lossesCount: {
        type: Number,
        default: 0,
      },
    },
  ],
  rounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Round",
    },
  ],
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
});

const GameSession = model<IGameSession>("GameSession", gameSession);

export default GameSession;
