const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("欢迎")
})

app.listen(5000) 