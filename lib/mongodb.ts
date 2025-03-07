import mongoose from "mongoose";

const NEXT_PUBLIC_MONGODB_API = process.env.NEXT_PUBLIC_MONGODB_API || "";

if (!NEXT_PUBLIC_MONGODB_API) {
  throw new Error("Please define the  environment variable inside .env");
}

interface CachedConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const globalWithCache = global as typeof global & {
  mongooseCache?: CachedConnection;
};

globalWithCache.mongooseCache = globalWithCache.mongooseCache || {
  conn: null,
  promise: null,
};

const cached = globalWithCache.mongooseCache;

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose
      .connect(NEXT_PUBLIC_MONGODB_API, opts)
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
