import { Document, Schema, Types, model } from 'mongoose'

export interface IMove {
  player: Types.ObjectId
  position: number
}

export interface IRound extends Document {
  winner: Types.ObjectId
  draw: boolean
  moves: IMove[]
  status: 'pending' | 'in-progress' | 'completed'
  gameSession: Types.ObjectId
}

const moveSchema = new Schema<IMove>({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  position: Number,
})

const roundSchema = new Schema<IRound>({
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  draw: {
    type: Boolean,
    default: false,
  },
  moves: [moveSchema],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  gameSession: {
    type: Schema.Types.ObjectId,
    ref: 'GameSession',
  },
})

const Round = model<IRound>('Round', roundSchema)

export default Round
