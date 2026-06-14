require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error('DATABASE_URL is not defined in environment variables. Please check your .env file.');
}

const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('finwise'); // your database name
    console.log('Connected to MongoDB');
  }
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

module.exports = { connectDB, getDB };
