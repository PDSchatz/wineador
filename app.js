require('dotenv').config()
const Express = require('express'),
      cors = require('cors'),
      mongoose = require('mongoose'),
      app = Express(),

      PORT = process.env.PORT || 4000,
      HOST = process.env.HOST || "127.0.0.1",
      MONGO_URL = process.env.MONGO_URL,

      db = require("./db"),
      auth = require('./controllers/auth'),
      wines = require('./controllers/wines'),
      userModel = require('./models/users'),
      wineModel = require('./models/wines')

app.use(cors())
app.use(Express.json())
app.use("/api/auth/", auth)
app.use("/api/wines/", wines)

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log(`Connected to: ${MONGO_URL}`))
  .catch((err) => console.error(`MongoDB error: ${err}`))

app.listen(PORT, HOST, () => {
  try {
    console.log(`listening on ${HOST} at ${PORT}`)
  } catch (error) {
    console.error(`server error: ${error}`)
  }
})


