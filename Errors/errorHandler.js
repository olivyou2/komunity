const errorHandler = (err, req, res) => {
  res.status(500).send(err.stack);
};

module.exports = {
  errorHandler,
};
