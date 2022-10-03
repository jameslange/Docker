const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_PORT,
  REDIS_URL,
} = require('./config/config')
const { createClient } = require('redis')

let RedisStore = require('connect-redis')(session)

let redisClient = createClient({
  legacyMode: true,
  socket: { host: REDIS_URL, port: REDIS_PORT },
})

redisClient
  .connect()
  .then(() => console.log('redis connected'))
  .catch(e => console.log('redis error', e))

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')
const app = express()
app.use(express.json())

// the @ mongo subs out the  ip for the name of the mongo service

// need to make sure db is running before app starts
function connectWithRetry() {
  mongoose
    .connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    )
    .then(() => console.log('Successfully connected to db'))
    .catch(e => {
      console.log(e)
      setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry()

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      resave: false,
      saveUninitialized: false,
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
)
app.enable('trust proxy')
app.use(cors())

app.get('/api/v1', (req, res) => {
  console.log('balanced?')
  res.send('<h2> Hi There </h2>')
})
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))
