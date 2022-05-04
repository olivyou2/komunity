const mongoose = require('mongoose');
const word = require('random-words');
const { Post } = require('../../Models');

const genPost = () => ({
  id: mongoose.Types.ObjectId(),
  title: word(),
  contents: word(),
  author: mongoose.Types.ObjectId(),
  gallery: mongoose.Types.ObjectId(),
});

const insertPost = async (post) => {
  await Post.insertMany({
    _id: post.id,
    title: post.title,
    contents: post.contents,
    author: post.author,
    gallery: post.gallery,
  });
};

module.exports = {
  genPost,
  insertPost,
};
