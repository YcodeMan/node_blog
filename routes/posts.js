const express = require('express')
const router = express.Router()


router.get('/', (req, res, next) => {

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
        var decoded = jwt.verify(req.cookies.Token, 'user')
        postModel.find({ "user": title }, (err, findData) => {
            if (err) throw err;
            if (findData.length != 0) {
                res.json({
                    errorCode: 302,
                    msg: '数据已存在,无法在插入新数据',
                    data: {}
                })
            } else {
                const post = {
                    'user': decoded._id,
                    'titleAuthor': author,
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
                   
                    // res.redirect(`/posts/${res._id}`)
                })

            }
        })
    }
})