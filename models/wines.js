const mongoose = require('mongoose')

const Wine = new mongoose.Schema(
  {
    wineName: {
      type: String,
      required: true
    }, 
    vintage: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("wine", Wine)