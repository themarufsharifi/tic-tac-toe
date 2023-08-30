import { Server } from 'socket.io'
import { createServer } from 'http'
import { Application } from 'express'
import { move } from './events/move'
import { gameInterrupt } from './events/game-interrupt'
import { EVENTS } from './constants'

export const initializeSocket = (server: Application) => {
  const httpServer = createServer(server)
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  })

  io.on('connection', (socket) => {
    socket.on(EVENTS.JOIN, (data) => {
      socket.join(data)
    })

    socket.on(EVENTS.GAME_START, (data) => {
      socket.to(data).emit(EVENTS.GAME_STARTED)
    })

    socket.on(EVENTS.NEW_ROUND, (data) => {
      socket.to(data).emit(EVENTS.NEW_ROUND_STARTED)
    })

    socket.on(EVENTS.FINISH_GAME, (data) => {
      socket.to(data).emit(EVENTS.GAME_FINISHED)
    })

    move(socket)
    gameInterrupt(socket)
    socket.on('disconnect', () => {})
  })

  return httpServer
}
