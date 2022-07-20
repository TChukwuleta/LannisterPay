const ApiError = require("../helper/ApiError");

let SplitBreakdown = [];
let Balance = 0;
const splitTransaction = async (body) => {
  try {
    const splitType = ["FLAT", "PERCENTAGE", "RATIO"];
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = body;
    Balance = Amount;
    let flatSplitTypes = [];
    let percentageSplitTypes = [];
    let ratioSplitTypes = [];
    if (SplitInfo.length < 1 || SplitInfo.length > 20)
      throw new ApiError(
        400,
        "Split info array out of bound. Split info must be between 1 and 20"
      );

    for (const element of SplitInfo) {
      if (!splitType.includes(element.SplitType)) {
        throw new ApiError(400, "Please provide a valid split type");
      }
      switch (element.SplitType) {
        case "FLAT":
          flatSplitTypes.push(element);
          break;
        case "PERCENTAGE":
          percentageSplitTypes.push(element);
          break;
        case "RATIO":
          ratioSplitTypes.push(element);
          break;
        default:
          break;
      }
    }

    // FLAT Split transaction
    if(flatSplitTypes.length >= 1){
        const flatBalance = await handleSplitForFlatType(flatSplitTypes, Balance, SplitBreakdown)
        if(!flatBalance) throw new ApiError(400, "Split Amount/Balance too low for further computation")
        Balance = Balance - flatBalance
        if(Balance <= 0) throw new ApiError(400, "Balance already too low for further computation")
    }

    // PERCENTAGE Split transaction
    if(percentageSplitTypes.length >= 1){
        const percentageBalance = await handleSplitForPercentageTypes(percentageSplitTypes, Balance, SplitBreakdown)
        if(!percentageBalance) throw new ApiError(400, "Split Amount/Balance too low for further computation")
        Balance = Balance - percentageBalance
        if(Balance <= 0) throw new ApiError(400, "Balance already too low for further computation")
    }

    // RATIO Split transaction
    if(ratioSplitTypes.length >= 1){
        const ratioBalance = await handleSplitForRatioTypes(ratioSplitTypes, Balance, SplitBreakdown)
        if(!ratioBalance) throw new ApiError(400, "Split Amount/Balance too low for further computation")
        Balance = Balance - ratioBalance
    }

    if(Balance < 0) throw new ApiError(400, "Final balance cannot be less than 0")

    const response = {
      ID,
      Balance,
      SplitBreakdown,
    };
    return response;
  } catch (error) {
    throw new ApiError(error.code || 500, error.message || error);
  }
};

const handleSplitForFlatType = async (flatArray, balance, SplitBreakdown) => {
  try {
    let flatValueCount = 0
    let flatBalance = balance;
    for (const element of flatArray) {
      if (flatBalance < 0) {
        throw new ApiError(
          400,
          "Insufficient balance to perform splitting. Balance is less than 0"
        );
      }
      const flatEntityAmount = element.SplitValue;
      if (flatEntityAmount < 0) {
        throw new ApiError(
          400,
          "Invalid amount computed. Computed amount cannot be less than 0"
        );
      }
      flatBalance = flatBalance - flatEntityAmount;
      flatValueCount = flatValueCount + flatEntityAmount;
      const flatSplitEntity = {
        SplitEntityId: element.SplitEntityId,
        Amount: flatEntityAmount,
      };
      SplitBreakdown.push(flatSplitEntity);
    }
    return flatValueCount;
  } catch (error) {
    throw new ApiError(error.code || 500, error.message || error);
  }
};

const handleSplitForPercentageTypes = async (percentageArray, balance, SplitBreakdown) => {
    try {
        let percentageValueCount = 0
        let percentageBalance = balance;
        for (const element of percentageArray) {
        if (percentageBalance < 0) {
            throw new ApiError(
            400,
            "Insufficient balance to perform splitting. Balance is less than 0"
            );
        }
        const percentageEntityAmount = (element.SplitValue / 100) * percentageBalance;
        if (percentageEntityAmount < 0) {
            throw new ApiError(
            400,
            "Invalid amount computed. Computed amount cannot be less than 0"
            );
        }
        percentageBalance = percentageBalance - percentageEntityAmount;
        percentageValueCount = percentageValueCount + percentageEntityAmount;
        const percentageSplitEntity = {
            SplitEntityId: element.SplitEntityId,
            Amount: percentageEntityAmount,
        };
        SplitBreakdown.push(percentageSplitEntity);
        }
        return percentageValueCount;
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

const handleSplitForRatioTypes = async (ratioArray, balance, SplitBreakdown) => {
    try {
        let ratioValueCount = 0
        let totalSplitRatio = ratioArray.reduce(function (x, y) {
            return x.SplitValue + y.SplitValue;
        });
        const openingRatioBalance = balance;
        for (const element of ratioArray) {
            if (openingRatioBalance < 0) {
                throw new ApiError(
                400,
                "Insufficient balance to perform splitting. Balance is less than 0"
                );
            }
            const ratioSplitAmount =
            (element.SplitValue / totalSplitRatio) * openingRatioBalance;
            if (ratioSplitAmount < 0)
            throw new ApiError(
                400,
                "Invalid amount computed. Computed amount cannot be less than 0"
            );
            ratioValueCount = ratioValueCount + ratioSplitAmount;
            const ratioSplitEntity = {
                SplitEntityId: element.SplitEntityId,
                Amount: ratioSplitAmount,
            };
            SplitBreakdown.push(ratioSplitEntity);
        }
        return ratioValueCount;
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error);
    }
}

module.exports = {
  splitTransaction,
};