const Transaction = require("../models/transaction");
const User = require("../models/user");

module.exports.displayDashboard = (req, res) => {
  res.render("./account/dashboard.ejs");
};

module.exports.displayUser = (req, res) => {
  res.locals.user = req.user;
  res.render("./account/details.ejs");
};

module.exports.transactionForm = (req, res) => {
  res.render("./account/transaction.ejs");
};

module.exports.depositTransaction = async (req, res) => {
  let { amount } = req.body;
  if (amount < 0) {
    req.flash("error", "Amount should be greater than 0.");
    return res.redirect("/account/transaction");
  }
  let user = req.user;
  let transaction = {
    amount: amount,
    transactionTime: Date.now(),
    transactionType: "Deposit",
    doneBy: user,
  };
  let result = new Transaction(transaction);
  let Updateduser = await User.findByIdAndUpdate(user._id, {
    $inc: { currBal: amount },
  },{new:true});
  result.balRemains = Updateduser.currBal;
  await Updateduser.save();
  await result.save();
  req.flash("success", "Amount Deposited");
  res.redirect("/account/dashboard");
};

module.exports.withdrawTransaction = async (req, res) => {
  let user = req.user;
  let { amount } = req.body;
  if (amount < 0) {
    req.flash("error", "Amount should be greater than 0.");
    return res.redirect("/account/transaction");
  }
  if (user.currBal < amount) {
    req.flash("error", "You don't have sufficient balance");
    return res.redirect("/account/transaction");
  }
  let transaction = {
    amount: amount,
    transactionTime: Date.now(),
    transactionType: "Withdraw",
    doneBy: user,
  };
  let result = new Transaction(transaction);
  let Updateduser = await User.findByIdAndUpdate(
    user._id,
    {
      $inc: { currBal: -amount },
    },
    { new: true }
  );
  result.balRemains = Updateduser.currBal;
  await Updateduser.save();
  await result.save();
  req.flash("success", "Amount Withdrawal");
  res.redirect("/account/dashboard");
};

module.exports.displayHistory = async (req, res) => {
  let result = await Transaction.find({ doneBy: req.user._id });
  res.render("./account/history.ejs", { result });
};
