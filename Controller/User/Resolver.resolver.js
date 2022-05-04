/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ERROR = require('../../Errors/errors');
const UserModel = require('../../Models/User.model');
const { SECRET_KEY } = require('../../Option/option');

const secretKey = process.env.SECRET_KEY;

module.exports = {
  // Query
  getUser: async ({ input: { name, password } }) => {
    const hashed = crypto.createHash('SHA256').update(password).digest('hex');
    if (await UserModel.exists({ name, password: hashed })) {
      const user = await UserModel.findOne({ name, password: hashed });

      const accessToken = jwt.sign({
        id: user._id.toHexString(),
        token: 'access',
      }, SECRET_KEY, {
        expiresIn: '1h',
      });

      const refreshToken = jwt.sign({
        id: user._id.toHexString(),
        token: 'refresh',
      }, SECRET_KEY, {
        expiresIn: '14d',
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    }

    throw new Error(ERROR.USER_NOT_EXISTS);
  },

  // Mutation
  createUser: async ({ input: { name, password } }) => {
    if (await UserModel.exists({ name })) {
      throw new Error(ERROR.USER_NAME_EXISTS);
    } else {
      const user = new UserModel();
      user.name = name;
      user.password = crypto.createHash('SHA256').update(password).digest('hex');
      await user.save();
      return user;
    }
  },

  removeUser: async ({ input: { name, password } }) => {
    const hashed = crypto.createHash('SHA256').update(password).digest('hex');
    if (await UserModel.exists({ name, password: hashed })) {
      await UserModel.deleteMany({ name, password: hashed });

      return true;
    }

    throw new Error(ERROR.USER_NOT_EXISTS);
  },

  refreshToken: async ({ input: { refreshToken } }) => {
    const payload = jwt.verify(refreshToken, secretKey);

    if (payload) {
      if (payload.token === 'refresh') {
        const accessToken = jwt.sign({
          id: payload.id,
          token: 'access',
        }, secretKey, {
          expiresIn: '1h',
        });

        return {
          accessToken,
          refreshToken,
        };
      }

      throw new Error(ERROR.TOKEN_NOT_VALID);
    } else {
      throw new Error(ERROR.TOKEN_EXPIRES);
    }
  },
};
