const router = require('express').Router()

router
  .route('/')
  .get((req, res) => {
    // get all wines
    const username = req.query.username
    console.log(username)
    res.send("GET wine route hit")
  })
  .post((req, res) => {
    const { 
      wineName, 
      vintage, 
      location, 
      price, 
      color, 
      grapes, 
      available,
      username
    } = req.body
    console.log(req.body)
    res.send("POST wine route hit!")
  })

router
  .route("/:id")
  .put((req, res)=> {
    const { id } = req.params
    const { 
      wineName, 
      vintage, 
      location, 
      price, 
      color, 
      grapes, 
      available
    } = req.body
    console.log(id)
    res.send("update wine route hit!")
  })
  .delete((req, res) => {
    const { id } = req.params
    console.log(id)
    res.send("DELETE wine route hit")
  })

module.exports = router