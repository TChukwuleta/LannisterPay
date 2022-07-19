const express = require("express")
const router = express.Router()
const transactionsplitRouter = require('./transactionsplit.route')

router.post("/split-payments/compute", transactionsplitRouter)