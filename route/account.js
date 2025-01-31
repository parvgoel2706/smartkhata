const express = require("express");
const router = express.Router();
const accountController = require("../controller/account");
const { isLoggedIn } = require("../middleware");

router.route("/dashboard").get(isLoggedIn, accountController.displayDashboard);

router.route("/details").get(isLoggedIn, accountController.displayUser);

router.route("/transaction").get(isLoggedIn, accountController.transactionForm);

router
  .route("/transaction/deposit")
  .post(isLoggedIn, accountController.depositTransaction);
router
  .route("/transaction/withdraw")
  .post(isLoggedIn, accountController.withdrawTransaction);

router
  .route("/transaction_history")
  .get(isLoggedIn, accountController.displayHistory);

module.exports = router;
