import fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import { reporterRoutes } from './routes/reporters.js'

dotenv.config()

const app = fastify({
  logger: true
})

// Enable cors for next.js local server
app.register(cors, {
  origin: "http://localhost:3000"
})

app.register(reporterRoutes, { prefix: '/reporters' })

const start = async () => {
  try {
    await app.listen({ port: 4000 })
    console.log(`Server running on port 4000`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

start();
