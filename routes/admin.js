const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('admin/index')
})
router.get('/addPost', (req, res, nexr) => {
    res.render('admin/addPost')
})


module.exports = router