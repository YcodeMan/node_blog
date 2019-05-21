const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const postModel = require('../models/posts')



// 连接数据库
mongoose.connect("mongodb://localhost/node_blog", { useNewUrlParser: true }).then(
    () => { console.log("connect ok") },
    err => { console.log('connect err') }
)
mongoose.set('useCreateIndex', true)
/* GET users listing. */


router.get('/a', (req, res, next) => {
    console.log(12332535636)
    next()
})





module.exports = router