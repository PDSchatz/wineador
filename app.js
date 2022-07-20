require('dotenv').config()
const Express = require('express'),
      cors = require('cors'),
      mongoose = require('mongoose'),
      app = Express(),
      PORT = process.env.PORT || 4000,
      HOST = process.end.HOST || "127.0.0.1",
      db = require("./db")

app.listen(PORT, HOST, () => {
  console.log(`listening on ${HOST} at ${PORT}`)
})


