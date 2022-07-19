const Joi = require("joi")

const splitTransaction = {
    body: Joi.object().keys({
        ID: Joi.required().message({
            "any.required": "Transaction ID is required"
        }),
        Amount: Joi.required().message({
            "any.required": "Amount is required"
        }),
        Currency: Joi.string().required().message({
            "string.empty": "Currency cannot be an empty field",
            "any.required": "Currency is required"
        }),
        CustomerEmail: Joi.string().required().message({
            "string.empty": "Customer's email cannot be an empty field",
            "any.required": "Customer's email is required"
        }),
    })
}

module.exports = {
    splitTransaction
}