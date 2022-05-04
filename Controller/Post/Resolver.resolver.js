const createError = require('http-errors');
const ERROR = require('../../Errors/errors');
const { Post, Gallery } = require('../../Models');

module.exports = {
  getPostIds: async ({ galleryId }) => {
    const posts = await Post.find({ gallery: galleryId });

    return posts;
  },

  getPost: async ({ postId }) => {
    const post = await Post.findById(postId);

    return post;
  },

  createPost: async ({ input: { title, contents }, galleryId }, req) => {
    const gallery = await Gallery.findById(galleryId);

    if (!gallery) {
      throw new createError.BadRequest(ERROR.GALLERY_NOT_EXISTS);
    }

    const post = new Post();
    post.title = title;
    post.contents = contents;
    post.gallery = gallery.id;
    post.author = req.user.id;

    await post.save();
    return post;
  },

  removePost: async ({ id }, req) => {
    const post = await Post.findById(id);

    if (!post) {
      throw new createError.BadRequest(ERROR.POST_NOT_EXISTS);
    }

    const gallery = await Gallery.findById(post.gallery);

    if (!gallery) {
      throw new createError.BadRequest(ERROR.GALLERY_NOT_EXISTS);
    }

    if (!post.author.equals(req.user.id) && !gallery.owner.equals(req.user.id)) {
      throw new createError.Forbidden(ERROR.POST_NOW_OWNED);
    }

    await Post.deleteMany({ id });
    return true;
  },

  updatePost: async ({ input: { title, contents }, postId }, req) => {
    const post = await Post.findById(postId);

    if (!post) {
      throw new createError.BadRequest(ERROR.POST_NOT_EXISTS);
    }

    if (!post.author.equals(req.user.id)) {
      throw new createError.Forbidden(ERROR.POST_NOW_OWNED);
    }

    await Post.updateMany(post, {
      $set: {
        title,
        contents,
      },
    });

    return true;
  },
};
