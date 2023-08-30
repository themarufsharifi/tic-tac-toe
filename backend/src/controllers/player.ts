import { Request, Response } from 'express'
import Player from '../models/player'

export const registerPlayer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    const newPlayer = new Player({ name })

    await newPlayer.save()

    res.status(201).json(newPlayer)
  } catch (error) {
    res.status(500).json({ error: 'Could not register player' })
  }
}

export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query
    const player = await Player.findById(id)

    if (!player) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.status(200).json(player)
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch player' })
  }
}
