const Router = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')

Router
  .route("/login")
  .post(async (req, res) => {
    const { username, password } = req.body
    const findUser = await User.findOne({ username })
    //! big brained shit... honestly, it rules!
    // the gist is that the logical && operand RETURNS the LAST truthy value in the statement... 
    // so if '!findUser' evaluates to true, then res.status().json() will always return true, 
    // and that statement will be returned and thus evaluated:
    /*
      ?  !findUser && res.status(400).json({
      ?    status: false,
      ?    message: "Could not find user with that userName"
      ?  })
    */
    //but for now, we're just gonna use a ternary :)
    !findUser ? res.status(400).json({
      status: false,
      message: "Could not find user with that userName"
    }) 
    : res.status(200).json({
        status: true,
        message: "user logged in",
        findUser
      })
  })

Router
  .route("/register")
  .post(async (req, res) => {
    try {
      const { name, username, email, password } = req.body
      if(!name || !username || !email || !password){
        throw new Error(`Insufficent data`)
      } else {
        const newUser = new User({
          name,
          username,
          email,
          password: bcrypt.hashSync(password, 10)
        })
        await newUser.save()
        res.status(200).json({
          status: true,
          message: "user registered",
          newUser
        })
      }
      
    } catch (error) {
      console.log(error)
    }
  });

  //TODO: route for PUT
  //TODO: route for DELETE
module.exports = Router

