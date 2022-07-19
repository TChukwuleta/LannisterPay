const express = require('express')
const app = express()
require("dotenv").config()
const logger = require("./helper/logger")
const routes = require('./routes/index')
const port = process.env.PORT
 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to LannisterPay splitting service" })
})

app.use(routes)

app.get("*", (req, res) => {
    res.status(404).json({ message: "Invalid route" })
})

app.listen(port, () => {
    logger.info(`Server started at ${port}`)
})