import mongoose from 'mongoose';

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("⚠️ MONGODB_URI is not defined in environment variables.");
    return false;
  }

  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cachedConnection.promise = mongoose.connect(mongoUri, opts)
      .then((mongooseInstance) => {
        console.log("✅ Successfully connected to MongoDB Atlas");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB Atlas Connection Error:", err.message);
        cachedConnection.promise = null;
        throw err;
      });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (e) {
    cachedConnection.promise = null;
    return false;
  }

  return cachedConnection.conn;
}
