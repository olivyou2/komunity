const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

module.exports = () => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    await mongoose.connect(mongod.getUri());
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(
        mongoose.connection.collections,
      ).map(async (collection) => collection.deleteMany()),
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });
};
