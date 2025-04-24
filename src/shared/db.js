const { MongoClient } = require('mongodb');
require('dotenv').config();


let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    socketTimeoutMS: 5000,
  });

  cachedDb = client.db();
  return cachedDb;
}

module.exports = { connectToDatabase };