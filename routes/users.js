var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')

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
  res.render('components/signup.ejs', {title: 'signup'})
})
// 配置登录模板页面
router.get("/login", (req, res, next) => {
  res.render('components/login.ejs', {title: 'login'})
})

module.exports = router;
