/* eslint-disable no-console */
const mongoose = require('mongoose');

const app = require('./app');
const { MONGOURL, PORT } = require('./Option/option');

mongoose.connect(MONGOURL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server open at ${PORT}`);
  });
});
