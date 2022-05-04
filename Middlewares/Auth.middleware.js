const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const catchAsync = require('../Errors/catchAsync');
const ERROR = require('../Errors/errors');
const { User } = require('../Models');

const secretKey = process.env.SECRET_KEY;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const authMiddleware = catchAsync(async (req, res, next) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split('Bearer ')[1];

    const result = jwt.verify(accessToken, secretKey);

    if (result) {
      const userId = result.id;
      const user = await User.findById(userId);

      req.user = user;
      next();
    } else {
      throw new createError.Unauthorized(ERROR.TOKEN_EXPIRES);
    }
  } else {
    throw new createError.Unauthorized(ERROR.TOKEN_NOT_INCLUDE);
  }
});

module.exports = authMiddleware;
