import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import apiRoutes from './routes/api'
import { initializeSocket } from './socket-config'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/tic-tac-toe'

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use('/api', apiRoutes)

// Connect to MongoDB
mongoose.connect(mongoURI)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

const server = initializeSocket(app)

server.listen(port, () => {
  console.log('server is running on port ', port)
})
