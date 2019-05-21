const mongoose = require('mongoose')

module.exports = () => {
    // 连接数据库
mongoose.connect("mongodb://localhost/node_blog", { useNewUrlParser: true }).then(
    () => { console.log("connect ok") },
    err => { console.log('connect err') }
  )
  mongoose.set('useCreateIndex', true)
}




