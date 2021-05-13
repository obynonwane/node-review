logger = (req, res, next) => {
  req.hello = "Hello world";
  console.log(`${req.protocol}://${req.get("host")}`);
  console.log("logger middleware ran");
  next();
};

module.exports = logger;
