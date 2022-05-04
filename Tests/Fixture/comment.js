const mongoose = require('mongoose');
const word = require('random-words');
const { Comment } = require('../../Models');

const genComment = () => ({
  id: mongoose.Types.ObjectId(),
  parent: mongoose.Types.ObjectId(),
  author: mongoose.Types.ObjectId(),
  gallery: mongoose.Types.ObjectId(),
  contents: word(),
});

const insertComment = async (comment) => {
  await Comment.insertMany({
    _id: comment.id,
    parent: comment.parent,
    author: comment.author,
    gallery: comment.gallery,
    contents: comment.contents,
  });
};

module.exports = {
  genComment,
  insertComment,
};
