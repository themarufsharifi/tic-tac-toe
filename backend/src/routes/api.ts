import { Router } from 'express'
import {
  createSession,
  registerPlayer,
  createRound,
  updateSession,
  getSessions,
  getSessionById,
  getPlayerById,
} from '../controllers'

const router = Router()

router.post('/register-player', registerPlayer)
router.post('/create-session', createSession)
router.post('/create-round', createRound)
router.put('/update-session', updateSession)
router.get('/sessions', getSessions)
router.get('/player', getPlayerById)
router.get('/session', getSessionById)

export default router
