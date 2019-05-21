var express = require('express');
var router = express.Router();
const connectDB = require('../config/connectDB')
const userModel = require('../models/posts')


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.use((req, res, next) => {
  // 判断当前用户是否登录
    if (req.cookies.username) {
      next()
    } else {
      res.redirect('/sign_in')
    }
})


router.use('/:username/posts', require('./userAction'), (req, res) => {
})

router.get('/', function (req, res, next) {
  res.redirect(`/users/${req.cookies.username}`)
});

router.get('/:username', (req, res, next) => {
  var user = req.cookies.username
  if (req.params.username != user) {
    res.redirect(`/users/${user}`)
  }
  
  res.render('user/index', {username: user} )
})







module.exports = router;
