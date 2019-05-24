const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const postModel = require('../models/posts')
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

router.get('/', (req, res, next) => {
    res.json({
        errorCode: 200,
        msg: '',
        data: {}
    })
    next()
})


// 配置添加文章模板页面
router.get('/addPost', (req, res, nexr) => {
    res.render('user/addPost', { title: '发布文章' })
})

// 处理添加文章请求
router.post('/addArticle', (req, res, next) => {
    var title = req.body.title,
        author = req.body.author,
        category = req.body.category,
        intro = req.body.intro,
        content = req.body.content
    // 合法性校验
    if (!(!!title && !!author && !!category && !!intro && !!content)) {
        res.json({
            errorCode: -1,
            msg: '请输入数据',
            data: {}
        })
    } else {
        jwt.verify(req.cookies.Token, 'user', (err, decoded) => {
            if (err) {
                res.json({
                    errorCode: -1,
                    msg: 'token已经过期了',
                    data: {}
                })
            }
            if (!decoded.username) {
                res.json({
                    errorCode: 601,
                    msg: "请重新登录",
                    data: {}
                })
            } else {
                postModel.find({ "title": title }, (err, findData) => {
                    if (err) throw err;
                    if (findData.length != 0) {
                        res.json({
                            errorCode: 302,
                            msg: '数据已存在,无法在插入新数据',
                            data: {}
                        })
                    } else {
                        const post = {
                            'id': decoded._id,
                            'titleAuthor': author,
                            'user': req.cookies.username,
                            'title': title,
                            'intro': intro,
                            'category': category,
                            'content': content
                        }
                        postModel.create(post, (err, data) => {
                            if (err) throw err
                            res.json({
                                errorCode: 200,
                                msg: '添加文章信息成功',
                                data: {}
                            })
                        })

                    }
                })
            }
        })

    }
})

// 查找通过id查找文章
router.get('/:id', (req, res, next) => {
    postModel.findById({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.redirect('../../')
        } else {
            if (data.length != 0) {
                markedIntro = marked(data.intro)
                markedData = marked(data.content)
                res.cookie('postId', req.params.id)
                res.render('user/postId', {
                    title: '用户首页',
                    data: data,
                    markedIntro,
                    markedData
                })

            } else {
                res.json({
                    errorCode: -1,
                    msg: '该数据不存在',
                    data: {}
                })
            }

        }

    })
})

router.get('/:id/edit', (req, res, next) => {
    var id = req.cookies.postId
    if (id != req.params.id) {
        res.redirect(`../${id}/edit`)
    }
    res.render('user/edit', {title: '修改文章内容'})
})

module.exports = router