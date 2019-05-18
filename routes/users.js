var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const userModel = require('../models/users')
const bcrypt = require('bcryptjs')

// 连接数据库
mongoose.connect("mongodb://localhost/node_blog", { useNewUrlParser: true }).then(
  () => { console.log("connect ok") },
  err => { console.log('connect err') }
)
mongoose.set('useCreateIndex', true)
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('main/index.ejs', { title: 'Express' });
});

// 配置注册页面模板
router.get("/sign_up", (req, res, next) => {
  res.render('signup.ejs')
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
          {"username": username},
          {"email": email}
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
          var salt = bcrypt.genSaltSync()
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
  res.render('signin.ejs',)
})

module.exports = router;
