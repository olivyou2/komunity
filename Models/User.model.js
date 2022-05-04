const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
