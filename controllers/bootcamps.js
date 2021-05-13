const Bootcamp = require("../models/Bootcaamp");
const Character = require("../models/Character");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");

//------------------------Aggregation for Products--------------------------------------------//
exports.createProduct = async (req, res, next) => {
  try {
    await Product.create([
      { product: "toothbrush", total: 4.75, customer: "Mike" },
      { product: "guiter", total: 199.99, customer: "Tom" },
      { product: "milk", total: 11.33, customer: "Mike" },
      { product: "Pizza", total: 8.5, customer: "Karen" },
      { product: "toothbrush", total: 4.75, customer: "Karen" },
      { product: "Pizza", total: 4.75, customer: "Dave" },
      { product: "toothbrush", total: 4.75, customer: "Mike" },
    ]);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//find out how many toothbrushes where sold
exports.howManyToothbrushSold = async (req, res, next) => {
  try {
    const docs = await Product.count({ product: "toothbrush" });
    res.status(200).json({
      success: true,
      count: docs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//find the list of all products sold without duplicate - distinct product
exports.listOfAllproductsSoldUnique = async (req, res, next) => {
  try {
    const docs = await Product.distinct("product");
    res.status(200).json({
      success: true,
      products: docs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//find the total amount of money spent by each customer and the array of products bought
exports.totalAmountOfMoneySpentByEachCustomer = async (req, res, next) => {
  try {
    const docs = await Product.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$customer",
          total: { $sum: "$total" },
          products: { $push: { product: "$product", total: "$total" } },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//find how much money was spent on each of the products - i.e totals of each of the products
exports.totalsOfEachOfTheProduct = async (req, res, next) => {
  try {
    const docs = await Product.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$product",
          total: { $sum: "$total" },
          customers: {
            $push: { name: "$customer", purchase_price: "$total" },
          },
        },
      },
      { $sort: { total: -1 } }, //sort by total decending
    ]);
    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//------------------------Aggregation for users-----------------------------------------------//
exports.createUser = async (req, res, next) => {
  try {
    await Character.create([
      { name: "Jean-Luc Picard", age: 59, rank: "Captain" },
      { name: "William Riker", age: 29, rank: "Commander" },
      { name: "Deanna Troi", age: 28, rank: "Lieutenant Commander" },
      { name: "Geordi La Forge", age: 29, rank: "Lieutenant" },
      { name: "Worf", age: 24, rank: "Lieutenant" },
    ]);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//the $match stage

exports.getAgeGreaterEqualTo30 = async (req, res, next) => {
  try {
    //AGREGATION FUNCTION AVG, COUNT, SUM, MAX, MIN
    //filter criteria  -- age greater or eequal to 30
    const filter = { age: { $gte: 30 } };

    // `$match` is similar to `find()`
    //  docs = await Character.find(filter);

    //search DB based on the criteria using aaggregate function
    let docs = await Character.aggregate([{ $match: filter }]);
    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//The $group state
exports.groupByAgeApplyingSum = async (req, res, next) => {
  try {
    let docs = await Character.aggregate([
      {
        $group: {
          // Each `_id` must be unique, so if there are multiple
          // documents with the same age, MongoDB will increment `count`.
          _id: "$age",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//combining multiple stages

exports.combineMultipleStage = async (req, res, next) => {
  // ALTERNATIVE SYNTAX
  // let docs = await Character.aggregate().
  // match({ age: { $lt: 30 } }).
  // group({ _id: '$age', count: { $sum: 1 } });
  try {
    let docs = await Character.aggregate([
      { $match: { age: { $lt: 30 } } },
      {
        $group: {
          _id: "$age",
          count: { $sum: 1 },
          average: { $avg: "$age" },
        },
      },
      {
        $project: {
          age: "$_id",
          count: 1,
          average: "$average",
          _id: 0,
        },
      },
    ]);

    console.log(docs);
    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//-----------------------------------------START BOOTCAMP CONTROLLERS HERE ----------------------------------------------//

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
