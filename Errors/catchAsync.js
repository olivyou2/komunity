const catchAsync = (asyncFn) => (async (req, res, next) => {
  try {
    return await asyncFn(req, res, next);
  } catch (error) {
    return next(error);
  }
});

module.exports = catchAsync;
