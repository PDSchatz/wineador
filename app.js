require('dotenv').config()
const Express = require('express'),
      cors = require('cors'),
      mongoose = require('mongoose'),
      app = Express(),

      PORT = process.env.PORT || 4000,
      HOST = process.env.HOST || "127.0.0.1",

      db = require("./db"),
      authMiddleware = require('./controllers/auth')

app.use(cors())
app.use(Express.json())
app.use("/api/auth/", authMiddleware)

app.listen(PORT, HOST, () => {
  try {
    console.log(`listening on ${HOST} at ${PORT}`)
  } catch (error) {
    console.error(`server error: ${error}`)
  }
})


