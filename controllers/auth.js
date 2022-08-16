const Router = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
//jwtwebtoken can take dates / times as numbers OR as human readable strings...
// here we use a number that is calculated by seconds: 
// 60s = 1m
// 60 * 1m = 1hr
// 24 * 1 hr = 1d
//alternatively, we could use the string "1d" and it *should* do the same thing...
const KEY_EXPIRATION = 60 * 60 * 24

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
     if(findUser){
      const verifyPwd = await bcrypt.compare(password, findUser.password)
      if(verifyPwd){
        const token = jwt.sign(
          {
            username: findUser.username
          },
          SECRET_KEY,
          {
            expiresIn: KEY_EXPIRATION
          }
        )
        res.status(200).json({
          status: true,
          message: "user logged in",
          token,
          findUser
        })
      } else {
        res.status(401).json({
          status: false,
          message: "password is incorrect"
        })
      }
    } else {
      res.status(406).json({
        status: false,
        message: "username not found"
      })
    }
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

        const token = jwt.sign(
          {
            username: newUser.username,
          }, 
          SECRET_KEY, 
          {
            expiresIn: KEY_EXPIRATION
          }
        )

        res.status(200).json({
          status: true,
          message: "user registered",
          token,
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

