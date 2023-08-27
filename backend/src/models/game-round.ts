import { Document, Schema, Types, model } from "mongoose";

export interface IMove {
  player: Types.ObjectId;
  position: number;
}

export interface IRound extends Document {
  players: Types.ObjectId[];
  winner: Types.ObjectId;
  loser: Types.ObjectId;
  draw: boolean;
  moves: IMove[];
  currentPlayer: Types.ObjectId;
  status: "pending" | "in-progress" | "completed";
}

const moveSchema = new Schema<IMove>({
  player: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  position: Number,
});

const roundSchema = new Schema<IRound>({
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  loser: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  draw: {
    type: Boolean,
    default: false,
  },
  moves: [moveSchema], // Array of moves, each containing player and position
  currentPlayer: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
});

const Round = model<IRound>("Round", roundSchema);

export default Round;
