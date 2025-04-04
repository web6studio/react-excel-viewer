import { MongoClient } from 'mongodb';

const {
  DB_NAME = 'excel-viewer',
  DB_HOST = 'localhost',
  DB_PORT = '27017',
  DB_USER,
  DB_PASSWORD,
} = process.env;

console.log(process.env.DB_PASSWORD);

const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
const client = new MongoClient(uri);

export const db = client.db(DB_NAME);

export const connectDB = async () => {
  await client.connect();
  console.log(`✅ Connected to MongoDB at ${DB_HOST}:${DB_PORT} (DB: ${DB_NAME})`);
};
