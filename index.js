require('./config/database')
const { ORIGIN } = require('./app/constant')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 5000

const app = express()
app.use(cookieParser())
app.use(express.json())

var corsOptions = {
  origin: ORIGIN,
  credentials: true
}

app.use(cors(corsOptions))

const { userRouter } = require('./app/controllers/user_controller')

app.get('/', (req, res) => {
  res.send('Welcome to the jwt auth')
})

app.use('/user', userRouter)

app.listen(port, () => {
  console.log('Listening to port', port)
})