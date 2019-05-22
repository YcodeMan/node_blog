var express = require('express');
var router = express.Router();
const connectDB = require('../config/connectDB')
const userModel = require('../models/users')


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
connectDB() 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main/index.ejs', { username: req.cookies.username });
});

// 配置注册页面模板
router.get("/sign_up", (req, res, next) => {
  res.render('signup.ejs', {title: '注册'})
})

// 实现注册功能
router.post('/register', (req, res, next) => {
  var username = req.body.username,
    password = req.body.password,
    email = req.body.email
  // 验证信息是否存在
  if (!(!!username && !!password && !!email)) {
    res.json({
      errorCode: -1,
      msg: '未提交数据,注册失败',
      data: {}
    })
  } else {
    // 数据库中查找用户是否存在
    userModel.find({
      $or: [
        { "username": username },
        { "email": email }
      ]
    }, (err, data) => {
      if (data.length != 0) {
        res.json({
          errorCode: 501,
          msg: '用户或者邮箱已存在',
          data: {}
        })
      } else {
        // 给密码加密(同步)
        var salt = bcrypt.genSaltSync(10)
        password = bcrypt.hashSync(password, salt)

        userModel.create({
          username,
          password,
          email
        }, (err, data) => {
          if (err) throw err
          res.json({
            errorCode: 200,
            msg: '用户注册成功',
            data: {}
          })
        })
      }
    })
  }
})
// 配置登录模板页面
router.get("/sign_in", (req, res, next) => {
  res.render('signin.ejs', {title: '登录'})
})

// 实现登录功能
router.post('/login', (req, res) => {
  var username = req.body.username,
      password = req.body.password
  if (!(!!username && !!password)) {
    res.json({
      errorCode: -1,
      msg: '用户名或密码未输入',
      data: {}
    })
  } else {
    
    userModel.findOne({ username }, (err, user) => {
      if (err) throw err
      // 判断是否找到,并对数据库中的密码比较是否相同(同步)
      if (user && bcrypt.compareSync(password, user.password)) {
        var token = jwt.sign({
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin
        }, 'user', {expiresIn: '1h'})
        
       
        res.cookie('Token', token)
        res.cookie('username', user.username) 
        res.json({
          errorCode: 200,
          msg: '登录成功',
          data: {}
        })
      } else {
        res.json({
          errorCode: 301,
          msg: '输入的用户名或密码错误',
          data: {}
        })
      }
    })
  }
})

// 实现退出功能
router.get('/sign_out', (req, res) => {
  res.clearCookie('Token')
  res.clearCookie('username') 
  res.redirect('/')
})

module.exports = router;
