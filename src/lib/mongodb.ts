"use server";

import { MongoClient, Db, type Document, type Collection } from 'mongodb';

const uri = process.env.MONGODB_URI as string | undefined;
const dbName = process.env.MONGODB_DB || 'tier-of-legends';

declare global {
  // cache client promise in dev to avoid multiple connections on HMR
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined =
  process.env.NODE_ENV === 'development' ? global._mongoClientPromise : undefined;

async function getClient(): Promise<MongoClient> {
  if (!uri) throw new Error('Missing MONGODB_URI in environment');
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientPromise = clientPromise;
    }
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(dbName);
}

export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
