const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const GalleryModel = mongoose.model('gallery', GallerySchema);

module.exports = GalleryModel;
