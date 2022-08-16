const router = require('express').Router()
const Wines = require('../models/wines')
const session = require('../middleware/session')

router
  .route('/')
  .get(session, async (req, res) => {
    // get all wines
    if(!req.user.username){
      let allWines = await Wines.find({})
      res.status(200).json(allWines)
    } else {
      const userWines = await Wines.find({username: req.user.username})
      if(userWines.length === 0){
        res.json({
          status: true,
          message: "this user has not entered any wines"
        })
      } else {
        res.status(200).json(userWines)
      }
    }
  })  
  .post(session, async (req, res) => {
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
    const newWine = new Wines({
      wineName,
      vintage, 
      location, 
      price, 
      color, 
      grapes, 
      available,
      username
    })
    try {
      await newWine.save()
      res.status(200).json({
        status: true,
        message: "wine successfully added to the DB",
        wine: newWine
      })
    } catch (error) {
      console.error(`something went wrong trying to add Wine to the DB: `, error)
      res.status(500).send(`Something went wrong adding wine to DB`)
    }
  })

router
  .route("/:id")
  .put(session, async (req, res)=> {
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
    if(!id){
      res.status(406).json({
        status: false,
        message: 'no valid ID included in request'
      })
    } else {
      const wineToUpdate = await Wines.findOne({_id: id})
      if(!wineToUpdate){
        res.status(500).json({
          status: false,
          message: "no wine with that ID was found in the DB"
        })
      } else {
        if (wineName) wineToUpdate.wineName = wineName
        if (vintage) wineToUpdate.vintage = vintage
        if (location) wineToUpdate.location = location
        if (price) wineToUpdate.price = price
        if (color) wineToUpdate.color = color
        if (grapes) wineToUpdate.grapes = grapes
        if (available) wineToUpdate.available = available
        try {
          await wineToUpdate.save()
          res.status(200).json({
            status: true,
            message: `Wine was successfully updated`
          })
        } catch (error) {
          console.error(`error occured updating Wine: `, error)
          res.status(500).json({
            status: false,
            message: `Failed to update wine in DB because: ${error}`
          })
        }
      }
    }
  })
  .delete(session, async (req, res) => {
    const { id } = req.params
    if(!id){
      res.status(406).json({
        status: false,
        message: 'no ID for that wine included'
      })
    } else {
      try {
        await Wines.findByIdAndDelete(id)
        res.status().json({
          status: true,
          message: `Wine successfully deleted`
        })
      } catch (error) {
        res.status(500).json({
          status: false,
          message: `No wine with that ID could be found`
        })
        console.log(`error deleting Wine from DB: ${error}`)
      }
    }
  })

module.exports = router