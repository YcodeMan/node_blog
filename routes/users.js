var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const userModel = require('../models/users')
const bcrypt = require('bcryptjs')

// mongoose.connect("mongodb://localhost/shop")
mongoose.connect("mongodb://localhost/node_blog", { useNewUrlParser: true }).then(
  () => { console.log("connect ok") },
  err => { console.log('connect err') }
)
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('main/index.ejs', { title: 'Express' });
});

// 配置注册页面模板
router.get("/sign_up", (req, res, next) => {
  res.render('signup.ejs', {title: 'signup'})
})

// 实现注册功能
router.post('/register', (req, res, next) => {
    var username = req.body.username,
        password = req.body.password,
        email = req.body.email
    if (!(!!username && !!password && !!email)) {
      res.json({
        errorCode: -1,
        msg: '未输入数据,注册失败',
        data: {}
      })
    } else {
      var salt = bcrypt.genSalt()
          password = bcrypt.hash(password, salt)
      userModel.find({
        "username": username
      }, (err, data) => {
        if (data.length != 0) {
          res.json({
            errorCode: 333
          })
        } else {
          
        }
      })
    }    

})
// 配置登录模板页面
router.get("/login", (req, res, next) => {
  res.render('login.ejs', {title: 'login'})
})

module.exports = router;
