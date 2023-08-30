import { Document, Schema, Types, model } from 'mongoose'

export interface IPlayer extends Document {
  name: string
  gameSession: Types.ObjectId
  round: Types.ObjectId
}

const playerSchema = new Schema<IPlayer>({
  name: {
    type: String,
    required: true,
  },
  gameSession: {
    type: Schema.Types.ObjectId,
    ref: 'GameSession',
  },
})

const Player = model<IPlayer>('Player', playerSchema)

export default Player
