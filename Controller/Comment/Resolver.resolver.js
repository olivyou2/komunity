const createError = require('http-errors');
const ERROR = require('../../Errors/errors');
const { Comment, Gallery } = require('../../Models');

module.exports = {
  createComment: async ({ input: { contents, parent, galleryId } }, req) => {
    const gallery = await Gallery.findById(galleryId);

    if (!gallery) {
      throw new createError.BadRequest(ERROR.GALLERY_NOT_EXISTS);
    }

    const comment = new Comment();
    comment.parent = parent;
    comment.contents = contents;
    comment.author = req.user.id;
    comment.gallery = galleryId;

    await comment.save();
    return comment;
  },

  removeComment: async ({ commentId }, req) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new createError.BadRequest(ERROR.COMMENT_NOT_EXISTS);
    }

    const gallery = await Gallery.findById(comment.gallery);

    if (!comment.author.equals(req.user.id) && !gallery.owner.equals(req.user.id)) {
      throw new createError.BadRequest(ERROR.COMMENT_NOW_OWNED);
    }

    await Comment.deleteMany(comment);
    return true;
  },

  getCommentIds: async ({ parent }) => {
    const comments = await Comment.find({ parent }, { id: 1 });

    return comments;
  },

  getComment: async ({ commentId }) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new createError.BadRequest(ERROR.COMMENT_NOT_EXISTS);
    }

    return comment;
  },
};
