const catchAsync = require("../helper/catchAsync");
const { splitTransactionService } = require("../services");

const splitTransaction = catchAsync(async (req, res) => {
  const result = await splitTransactionService.splitTransaction(req.body);
  res.status(201).send({
    message: "Split transaction was successful",
    result
  });
});

module.exports = {
  splitTransaction,
};
