import { Request, Response } from 'express'
import GameSession from '../models/session'

export const createSession = async (req: Request, res: Response) => {
  const { playerId } = req.body

  try {
    // Check if there's an active game session with just one player
    const activeSession = await GameSession.findOne({
      status: 'active',
      players: { $size: 1 },
    })

    if (activeSession) {
      // Add the player to the existing game session
      await GameSession.findByIdAndUpdate(
        activeSession._id,
        {
          $push: {
            players: {
              player: playerId,
              winsCount: 0,
              drawsCount: 0,
              lossesCount: 0,
            },
          },
        },
        { new: true }
      )

      return res.status(200).json({ _id: activeSession._id })
    }

    // Create a new game session
    const newGameSession = new GameSession({
      players: [
        { player: playerId, winsCount: 0, drawsCount: 0, lossesCount: 0 },
      ],
    })

    await newGameSession.save()
    res.status(201).json(newGameSession)
  } catch (error) {
    res.status(500).json({ error: 'Could not create game session' })
  }
}

export const getSessions = async (_: Request, res: Response) => {
  try {
    const gameSessions = await GameSession.find({
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'players.player',
        model: 'Player',
      })

    res.status(200).json(gameSessions)
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch game sessions' })
  }
}

export const getSessionById = async (req: Request, res: Response) => {
  const sessionId = req.query.id

  try {
    const gameSession = await GameSession.findById(sessionId).populate({
      path: 'players.player',
      model: 'Player',
    })

    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found' })
    }

    res.status(200).json(gameSession)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not fetch game session' })
  }
}

export const updateSession = async (req: Request, res: Response) => {
  try {
    const { sessionId, status } = req.body

    const session = await GameSession.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    )

    if (!session) {
      return res.status(404).json({ error: 'Game session not found' })
    }

    res.status(200).json(session)
  } catch (error) {
    res.status(500).json({ error: 'Could not update game session status' })
  }
}
