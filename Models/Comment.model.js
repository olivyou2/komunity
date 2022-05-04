const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    gallery: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const CommentModel = mongoose.model('comment', CommentSchema);

module.exports = CommentModel;
