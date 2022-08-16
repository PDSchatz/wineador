/*
  This middleware will handle the "session token" verification when a request comes through wines.js
*/
const jwt = require("jsonwebtoken")
const User = require("../models/users")
const SECRET_KEY = process.env.SECRET_KEY

const session = async (req,res,next) => {
  try {
    if(req.method === "OPTIONS"){
      //if req.method is "OPTIONS", it is a "pre-flight request" and we need to let it through
      //otherwise it will break the routes trying to use .
      next()
    } else if (req.headers.authorization) {
      //JWT tokens return from the headers as: "Bearer [token]"... we only need the [token] portion
      //so, we split the headers.auth string, splits it at the space, and then return the 2nd value of the array
      //* as a failsafe, if the token doesn't include "bearer", but is a valid token, we fall back to the full string
      //* of req.headers.auth
      const token = req.headers.authorization.includes("Bearer") ? 
        req.headers.authorization.split(' ')[1] :
        req.headers.authorization
      
        //jwt.verify is supposed to be syncronous, but seems to be creating a race situation where if(payload) seems to be firing 
        //BEFORE the verification is done, and then hitting "next"...
        //so we had to move next() into the if(payload conditional)
      const payload = token ? jwt.verify(token, SECRET_KEY) : res.status(500).json({ status: false, message: 'malformed headers or auth token'})
      
      if(payload) {
        next()
        const findUser = await User.findOne({username: payload.username})
        if(findUser){
          //this is SICK. Just like sockets in socket.io, you can add custom key/value pairs to the request object
          //now in wines, we no longer need to use a parameter or a query search string, we can just access "req.user.username"
          //v. dope.
          req.user = findUser
          next()
        } else {
          res.status(400).json({status: false, message: 'user not found'})
        }
      }
    } else {
      res.status(403).json({status: false, message: 'FORBIDDEN.'})
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `session authentication error: ${error}`
    })
  }
}

module.exports = session