const express = require('express')
const mongoose = require('mongoose')
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require('./config/config')

const router = require('./routes/postRoutes')
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

app.use('/api/v1/posts', router)
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))
