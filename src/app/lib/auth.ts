import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const client = new MongoClient(uri);

export const auth = betterAuth({
  database: mongodbAdapter(client.db(), { client }),

  emailAndPassword: {
    enabled: true,
  },
});