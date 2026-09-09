import mongoose from "mongoose";

let memoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hala-jewels";

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[db] connected to MongoDB at ${uri}`);
    return;
  } catch (err) {
    console.warn(`[db] could not reach ${uri} (${err.message}).`);
    console.warn("[db] falling back to an in-memory MongoDB instance for local development.");
  }

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  memoryServer = await MongoMemoryServer.create({ instance: { dbName: "hala-jewels" } });
  const memUri = memoryServer.getUri("hala-jewels");
  await mongoose.connect(memUri);
  console.log("[db] connected to in-memory MongoDB (data resets on server restart).");
  console.log("[db] to persist data, install MongoDB locally or set MONGODB_URI to a real instance / Atlas cluster.");
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}

export function isUsingMemoryServer() {
  return memoryServer !== null;
}
