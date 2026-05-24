import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) throw new Error("Please provide MONGODB_URI in .env");

const client = new MongoClient(uri);

export const dbClient = client.connect();
