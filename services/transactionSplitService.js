const ApiError = require("../helper/ApiError")


const splitTransaction = async(body) => {
    try {
        const splitType = ["FLAT", "PERCENTAGE", "RATIO"]
        const { ID, Amount, Currency, CustomerEmail, SplitInfo } = body
        if(SplitInfo.length < 1 || SplitInfo.length > 20) throw new ApiError(400, "Split info array out of bound. Split info must be between 1 and 20")
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
} 

module.exports = {
    splitTransaction
}