const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    meta: {
      createAt: {
        type: Date,
        default: Date.now()
      }
    }
})
module.exports = mongoose.model( 'user', userSchema, 'user')