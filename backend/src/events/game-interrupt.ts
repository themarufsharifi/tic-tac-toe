import { Socket } from 'socket.io'
import Round from '../models/round'
import GameSession from '../models/session'
import { EVENTS } from '../constants'

export const gameInterrupt = async (socket: Socket) => {
  socket.on(EVENTS.GAME_INTERRUPT, async (data) => {
    const { sessionId, playerId } = data
    try {
      const session = await GameSession.findById(sessionId)

      if (!session) {
        console.error('Game session not found.')
        return
      }

      const rounds = await Round.find({ gameSession: sessionId })

      if (session.players.length === 1) {
        await GameSession.findByIdAndRemove(sessionId)
        console.log('Session removed because it had only one player.')
        return
      }

      if (rounds.length === 1) {
        const round = rounds[0]

        if (round.status === 'completed') {
          session.status = 'completed'
          socket.to(sessionId).emit(EVENTS.GAME_INTERRUPTED)
          await session.save()
          console.log('Session marked as completed due to a completed round.')
        } else if (round.moves.length === 0) {
          round.status = 'pending'
          await round.save()
          session.players = session.players.filter(
            (player) => player.player.toString() !== playerId.toString()
          )
          await session.save()
          console.log(
            'Round changed to pending, and the current player removed.'
          )
        } else {
          await GameSession.findByIdAndRemove(sessionId)
          socket.to(sessionId).emit(EVENTS.GAME_INTERRUPTED)
          return
        }
      }

      if (rounds.length > 1) {
        const completedRoundExists = rounds.some(
          (round) => round.status === 'completed'
        )

        if (completedRoundExists) {
          await Round.deleteMany({
            gameSession: sessionId,
            status: { $in: ['pending', 'in-progress'] },
          })
          session.status = 'completed'
          socket.to(sessionId).emit(EVENTS.GAME_INTERRUPTED)
          await session.save()
          console.log('Session marked as completed due to a completed round.')
        }
      }
    } catch (error) {
      console.error('Error updating game session:', error)
    }
  })
}
