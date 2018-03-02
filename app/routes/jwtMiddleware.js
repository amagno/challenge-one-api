
module.exports = (req, res, next) => {
  const headerToken = req.headers;
  console.log(headerToken);

  return next();
};
