/* eslint-disable no-underscore-dangle */
const createError = require('http-errors');
const ERROR = require('../../Errors/errors');
const { Gallery } = require('../../Models');

module.exports = {
  createGallery: async ({ name }, req) => {
    if (await Gallery.exists({ name })) {
      throw new createError.BadRequest(ERROR.GALLERY_EXISTS);
    }

    const gallery = new Gallery();
    gallery.name = name;
    gallery.owner = req.user._id;
    gallery.save();

    return gallery;
  },

  removeGallery: async ({ id }, req) => {
    if (!await Gallery.exists({ id })) {
      throw new createError.BadRequest(ERROR.GALLERY_NOT_EXISTS);
    }

    const gallery = await Gallery.findById(id);

    if (!gallery.owner.equals(req.user.id)) {
      throw new createError.Forbidden(ERROR.GALLERY_NOT_OWNED);
    }

    await Gallery.deleteMany({ id });

    return true;
  },

  getGallery: async ({ id }) => {
    const gallery = await Gallery.findById(id);

    return gallery;
  },

  getGalleryIds: async () => {
    const galleries = await Gallery.find({}, { id: 1 });

    return galleries;
  },
};
