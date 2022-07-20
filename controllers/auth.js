const Router = require('express').Router()
Router
  .route("/login")
  .post(async (req, res) => {
    const { username, password } = req.body
    console.log(`from login: `, username, password)
    res.send("login route hit")
  })

Router
  .route("/register")
  .post(async (req, res) => {
    const { name, username, email, password } = req.body
    console.log(`from register: `, name, username, email, password)
    res.send("register route hit!")
  });

  //TODO: route for PUT
  //TODO: route for DELETE
module.exports = Router

