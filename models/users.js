const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
   name: {
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
      type: 'string',
      required: true
    },
    meta: {
      createAt: {
        type: Date,
        default: Date.now()
      }
    }
})
module.exports = mongoose.model( 'user', userSchema, 'user')