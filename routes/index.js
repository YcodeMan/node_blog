var express = require('express');
var router = express.Router();
const connectDB = require('../config/connectDB')
const userModel = require('../models/users')
const postsModel = require('../models/posts')


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
connectDB()

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

/* GET home page. */
// 页面加载所有文章
router.get('/', function (req, res, next) {
  postsModel.find({}, (err, data) => {
    if (err) {
      res.json({
        errorCode: -1,
        msg: '数据无查找到，数据库连接错误'
      })
    } else {
      if (data.length == 0) {
        res.json({
          errorCode: 301,
          msg: '没有数据',
          data: {}
        })
      } else {
        res.render('main/index', {
          title: '首页',
          username: req.cookies.username,
          'data': data
        })
      }
    }
  })
});

router.get('/:id', (req, res, next) => {
  var id = req.params.id
  postsModel.findOneAndUpdate(
    { _id: id },
    {
      $inc: {
        pv: 1 //每次自增长1
      }
    },
    {
      new: true //设置true 获取的是更新之后的值
    },
    (err, data) => {
      if (err) {
        next()
      } else {
        markedIntro = marked(data.intro)
        markedData = marked(data.content)
        res.render('user/postId', {
          title: '文章',
          data,
          markedIntro,
          markedData
        })
      }
    })
})

// 配置注册页面模板
router.get("/sign_up", (req, res, next) => {
  res.render('signup.ejs', { title: '注册' })
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
  res.render('signin.ejs', { title: '登录' })
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
        }, 'user', { expiresIn: '1h' })


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
