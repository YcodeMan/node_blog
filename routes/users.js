var express = require('express');
var router = express.Router();
const postsModel = require('../models/posts')
const marked = require("marked")



// 配置marked
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: false,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})
 

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 判断当前用户是否登录,没有登录跳转登录页面
router.use((req, res, next) => {
    if (req.cookies.username) {
      next()
    } else {
      res.redirect('/sign_in')
    }
})

// 刷新jwt
router.use((req, res, next) => {
  jwt.verify(req.cookies.Token, 'user', (err, decoded) => {
    if (err) {
      res.redirect('/sign_in')
    }
    var token = jwt.sign({
      _id: decoded._id,
      isAdmin: decoded.isAdmin,
      username: decoded.username
    }, 'user', {expiresIn: '1h'})
    res.cookie('Token', token)
    next()
  })
  // next()
})

// 把文章操作的路由挂载在当前用户下
router.use('/:username/posts', (req, res, next) => {
  
  if (req.params.username !== req.cookies.username) {
    res.redirect(`/users/${req.cookies.username}/posts`)
    next()
  }
  next()
}, require('./posts'))
  

router.get('/', function (req, res, next) {
  res.redirect(`/users/${req.cookies.username}`)
});

router.get('/:username', (req, res, next) => {
  var user = req.cookies.username
  res.clearCookie('postId')
  if (req.params.username != user) {
    return res.redirect(`/users/${user}`)
  }
  postsModel.find({"user":user }, (err, data) => {
    if (err) throw err
    res.render('user/index', {
      username: user, 
      postsData: data
    })
  })
})

module.exports = router;
