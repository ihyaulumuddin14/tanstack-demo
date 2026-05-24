import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI')
}

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

let cached: MongooseCache

if (!global.mongooseCache) {
  global.mongooseCache = {
    conn: null,
    promise: null,
  }
}

cached = global.mongooseCache

export async function connectDB() {
  if (cached.conn) {
    console.log('Using cached database connection')
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  cached.conn = await cached.promise
  console.log('New database connection established')
  return cached.conn
}