const mongoose = require('mongoose');
const word = require('random-words');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../../Models');
const { SECRET_KEY } = require('../../Option/option');

const genUser = () => ({
  id: mongoose.Types.ObjectId(),
  name: word(),
  password: word(),
});

const genAccessToken = (user) => {
  const accessToken = jwt.sign({
    id: user.id.toHexString(),
    token: 'access',
  }, SECRET_KEY, {
    expiresIn: '1h',
  });

  return accessToken;
};

const genRefreshToken = (user) => {
  const accessToken = jwt.sign({
    id: user.id.toHexString(),
    token: 'refresh',
  }, SECRET_KEY, {
    expiresIn: '1h',
  });

  return accessToken;
};

const insertUser = async (user) => {
  const password = crypto.createHash('SHA256').update(user.password).digest('hex');
  await User.insertMany({
    _id: user.id,
    name: user.name,
    password,
  });
};

module.exports = {
  genUser,
  genAccessToken,
  genRefreshToken,

  insertUser,
};
