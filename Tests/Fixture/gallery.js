const mongoose = require('mongoose');
const word = require('random-words');
const { Gallery } = require('../../Models');

const genGallery = () => ({
  id: mongoose.Types.ObjectId(),
  name: word(),
  owner: mongoose.Types.ObjectId(),
});

const insertGallery = async (gallery) => {
  await Gallery.insertMany({
    _id: gallery.id,
    name: gallery.name,
    owner: gallery.owner,
  });
};

module.exports = {
  genGallery,

  insertGallery,
};
