const catchAsync = require('../helper/catchAsync')
const { splitTransactionService } = require('../services')

const splitTransaction = catchAsync(async function(req, res){
    const result = splitTransactionService.splitTransaction(req.body)
    res.status(201).send({
        message: "Split transaction was successful",
        data: {
            result
        }
    })
})

module.exports = {
    splitTransaction
}