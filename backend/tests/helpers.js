
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: "7.0.14"
    }
  });

  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 300000);

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});

const createTestUser = async () => {
  return await User.create({
    username: "testuser",
    email: "test@example.com",
    password: "Password123",
    emailVerified: true
  });
};

const generateTestToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = {
  createTestUser,
  generateTestToken
};
