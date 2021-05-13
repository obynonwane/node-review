const express = require("express");
router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  // ----user aggregation ----/
  createUser,
  getAgeGreaterEqualTo30,
  groupByAgeApplyingSum,
  combineMultipleStage,

  // ----Products aggregation ---/
  createProduct,
  howManyToothbrushSold,
  listOfAllproductsSoldUnique,
  totalAmountOfMoneySpentByEachCustomer,
  totalsOfEachOfTheProduct,
} = require("../controllers/bootcamps");

//------UserAggregation---------------//
router.post("/user", createUser);
router.get("/age_greater_thaan_equal_30", getAgeGreaterEqualTo30);
router.get("/group_by_age", groupByAgeApplyingSum);
router.get("/combine_multiple_stages", combineMultipleStage);

//----Product Aggregation ------------//
router.post("/product", createProduct);
router.get("/how_many_toothbrush_was_sold", howManyToothbrushSold);
router.get("/unique_list_of_products_sold", listOfAllproductsSoldUnique);
router.get(
  "/total_amount_of_money_spent_by_each_customer",
  totalAmountOfMoneySpentByEachCustomer
);
router.get(
  "/total_amount_of_money_spent_on_each_product",
  totalsOfEachOfTheProduct
);

//-------Bootcamp Route-------------//
router.get("/", getBootcamps);
router.get("/:id", getBootcamp);
router.post("/", createBootcamp);
router.put("/:id", updateBootcamp);
router.delete("/:id", deleteBootcamp);

module.exports = router;
