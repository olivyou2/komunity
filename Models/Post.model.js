const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  gallery: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
}, {
  timestamps: true,
});

const PostModel = mongoose.model('post', PostSchema);
module.exports = PostModel;
