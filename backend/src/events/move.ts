import { Socket } from 'socket.io'
import Round from '../models/round'
import GameSession, { IGameSessionPlayer } from '../models/session'
import { EVENTS } from '../constants'

export const move = async (socket: Socket) => {
  socket.on(EVENTS.MOVE_SEND, async (data) => {
    try {
      const {
        roundId,
        playerId,
        sessionId,
        position,
        isCompleted = false,
        isWin = false,
      } = data

      const round = await Round.findById(roundId)
      let gameSession = null

      if (round) {
        round.moves.push({ player: playerId, position })

        if (isCompleted || isWin) {
          gameSession = await GameSession.findById(sessionId)
          if (gameSession) {
            let newPlayers: IGameSessionPlayer[] = []
            const playerArray = gameSession.players.map((player) =>
              player.toObject()
            )
            round.status = 'completed'
            if (isWin) {
              round.winner = playerId
              round.draw = false

              newPlayers = playerArray.map((player) => {
                if (player.player == playerId) {
                  return { ...player, winsCount: player.winsCount + 1 }
                } else {
                  return { ...player, lossesCount: player.lossesCount + 1 }
                }
              })
            } else {
              round.draw = true
              newPlayers = playerArray.map((player) => {
                return { ...player, drawsCount: player.drawsCount + 1 }
              })
            }

            gameSession.players = newPlayers
          }
        }

        socket.to(sessionId).emit(EVENTS.MOVE_RECEIVE, {
          position,
          completed: isCompleted,
          winner: isWin ? playerId : null,
        })

        await round.save()
        await gameSession?.save()
      }
    } catch (error) {
      console.log('this error happened when you move: ', error)
    }
  })
}
