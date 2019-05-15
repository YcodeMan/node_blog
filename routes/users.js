var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a  aaa');
});

// 配置注册页面模板
router.get("/sign_up", (req, res, next) => {
   res.render('components/signup.ejs', {title: 'signup'})
})
// 配置登录模板页面
router.get("/login", (req, res, next) => {
  res.render('components/login.ejs', {title: 'signup'})
})

module.exports = router;
