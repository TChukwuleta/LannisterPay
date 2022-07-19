const express = require("express")
const router = express.Router()
const validate = require('../helper/validate')
const transactionSplitPolicy = require('../policies/transactionsplit.policy')
const splitTransactionController = require('../controllers/transactionsplit.controller')

router.post(
    "/split-payments/compute", 
    [validate(transactionSplitPolicy.splitTransaction)],
    transactionSplitPolicy.splitTransaction
)

module.exports = router