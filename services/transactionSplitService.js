const ApiError = require("../helper/ApiError")


const splitTransaction = async(body) => {
    try {
        const splitType = ["FLAT", "PERCENTAGE", "RATIO"]
        const { ID, Amount, Currency, CustomerEmail, SplitInfo } = body
        let Balance = Amount
        let SplitBreakdown = []
        let flatSplitTypes = []
        let percentageSplitTypes = []
        let ratioSplitTypes = []
        if(SplitInfo.length < 1 || SplitInfo.length > 20) throw new ApiError(400, "Split info array out of bound. Split info must be between 1 and 20")
        SplitInfo.forEach(element => {
            if(!splitType.includes(element.SplitType)) throw new ApiError(400, "Please provide a valid split type")
            switch (element.SplitType) {
                case "FLAT":
                    flatSplitTypes.push(element)
                    break;
                case "PERCENTAGE":
                    percentageSplitTypes.push(element)
                    break;
                case "RATIO":
                    ratioSplitTypes.push(element)
                    break;
                default:
                    break;
            }
        });

        // FLAT
        flatSplitTypes.forEach(element => {
            if(Balance < 0) throw new ApiError(400, "Insufficient balance to perform splitting. Balance is less than 0")
            const flatEntityAmount = element.SplitValue
            if(flatEntityAmount < 0) throw new ApiError(400, "Invalid amount computed. Computed amount cannot be less than 0")
            Balance = Balance - flatEntityAmount
            const flatSplitEntity = {
                SplitEntityId: element.SplitEntityId,
                Amount: flatEntityAmount
            }
            SplitBreakdown.push(flatSplitEntity)
        });

        // PERCENTAGE
        percentageSplitTypes.forEach(element => {
            if(Balance < 0) throw new ApiError(400, "Insufficient balance to perform splitting. Balance is less than 0")
            const percentageEntityAmount = (element.SplitValue / 100) * Balance
            if(percentageEntityAmount < 0) throw new ApiError(400, "Invalid amount computed. Computed amount cannot be less than 0")
            Balance = Balance - percentageEntityAmount
            const percentageSplitEntity = {
                SplitEntityId: element.SplitEntityId,
                Amount: percentageEntityAmount
            }
            SplitBreakdown.push(percentageSplitEntity)
        });

        // RATIO
        let totalSplitRatio = ratioSplitTypes.reduce(function(x, y) {
            return x.SplitValue + y.SplitValue;
        })
        const openingRatioBalance = Balance
        let ratioSplitter = ratioSplitTypes.map(x => {
            if(Balance < 0) throw new ApiError(400, "Insufficient balance to perform splitting. Balance is less than 0")
            const ratioSplitAmount = (x.SplitValue / totalSplitRatio) * openingRatioBalance;
            if(ratioSplitAmount < 0) throw new ApiError(400, "Invalid amount computed. Computed amount cannot be less than 0")
            Balance = Balance - ratioSplitAmount
            const ratioSplitEntity = {
                SplitEntityId: x.SplitEntityId,
                Amount: ratioSplitAmount
            }
            SplitBreakdown.push(ratioSplitEntity)
        });
        var response = {
            ID,
            Balance,
            SplitBreakdown
        }
        return response
        
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error); 
    }
} 

module.exports = {
    splitTransaction
}