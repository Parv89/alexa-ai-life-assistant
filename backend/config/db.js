import mongoose from 'mongoose';

let isConnected = false;
let connectionError = null;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alexa_ai_assistant';
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000, // Quick timeout to avoid hanging if DB server is off
    });
    
    isConnected = true;
    connectionError = null;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}.`);
    console.warn(`[MongoDB Warning] Reason: ${error.message}`);
    console.warn(`[MongoDB Fallback] Backend will run with high-performance In-Memory Fallback store. To persist data to MongoDB, start mongod service or configure MONGODB_URI in backend/.env.`);
    return false;
  }
};

export const getDBStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
    error: connectionError,
    mode: isConnected ? 'mongodb' : 'in-memory-fallback'
  };
};
