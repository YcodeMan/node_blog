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
        content = req.body.content,
        id = req.cookies.postId
    // 合法性校验
    if (!(!!title && !!author && !!category && !!intro && !!content)) {
        return res.json({
            errorCode: -1,
            msg: '请输入数据',
            data: {}
        })
    } else {
        jwt.verify(req.cookies.Token, 'user', (err, decoded) => {
            if (err) {
                return res.json({
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
                // 不能添加相同的标题
                postModel.find({ "title": title }, (err, findData) => {
                    if (err) throw err;
                    if (findData.length != 0) {
                        return res.json({
                            errorCode: 302,
                            msg: '标题已存在,无法在插入新数据',
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
                        if (req.cookies.postId) {
                            postModel.update({_id: req.cookies.postId},post, (err, data) => {
                                if (err) throw err
                                res.json({
                                    errorCode: 200,
                                    msg: '更新数据成功',
                                    data: {}
                                }) 
                            })
                        } else {
                            postModel.create(post, (err, data) => {
                                if (err) throw err
                             return res.json({
                                    errorCode: 200,
                                    msg: '添加文章信息成功',
                                    data: {}
                                })
                            })
                        }
                       
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
                res.cookie('postId', req.params.id)
                markedIntro = marked(data.intro)
                markedData = marked(data.content)
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
// 设置修改文章内容
router.get('/:id/edit', (req, res, next) => {
    
    postModel.find({_id: req.params.id}, (err, data) => {
        if (err) { 
            next()
        } else {
            res.cookie('postId', req.params.id)
            var data = data[0]
            if (data.length !=0) {
                res.render('user/addPost', {
                    title: '修改文章内容',
                    data
                })
            }
        }
       
    }) 
})
router.post('/:id/addArticle', (req, res, next) => {    
        res.redirect(307, '../addArticle')   
})
// 删除文章
router.get('/:id/del', (req, res, next) => {
    postModel.remove({_id: req.params.id}, (err, data) => {
        if (err) { 
            next()
        } else {
            if (data.ok == 1) {
                res.json({
                    errorCode: 200,
                    msg: '文章删除成功',
                    data: {}
                })
            }
        }
       
    }) 
})
module.exports = router