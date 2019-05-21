const express = require('express')
const router = express.Router()
const postsModel = require('../models/posts')

router.get('/', (req, res, next) => {
    res.render('admin/index')
})
// 配置添加文章模板页面
router.get('/addPost', (req, res, nexr) => {
    res.render('user/addPost', {title: '发布文章'})
})

// 处理添加文章请求
router.post('/addArticle', (req, res, next) => {
    var title = req.body.title,
        author = req.body.author,
        category = req.body.category,
        intro = req.body.intro,
        content = req.body.content
        // 合法性校验
    if ( !(!!title && !!author && !!category && !!intro && !!content)) {
        res.json({
            errorCode: -1,
            msg: '请输入数据',
            data: {}
        })
    } else {
    }
})

module.exports = router