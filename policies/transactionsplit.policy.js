const Joi = require("joi")

const splitTransaction = {
    body: Joi.object({
        ID: Joi.number().integer().required().messages({
            "any.required": "Transaction ID is required"
        }),
        Amount: Joi.number().integer().required().messages({
            "any.required": "Amount is required"
        }),
        Currency: Joi.string().required().messages({
            "string.empty": "Currency cannot be an empty field",
            "any.required": "Currency is required"
        }),
        CustomerEmail: Joi.string().required().messages({
            "string.empty": "Customer's email cannot be an empty field",
            "any.required": "Customer's email is required"
        }),
    })
}

module.exports = {
    splitTransaction
}