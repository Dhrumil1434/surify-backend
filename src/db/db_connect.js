import mongoose from 'mongoose';
import dotenv from 'dotenv';
import asyncHandler from '../utils/async_handler.js';
import handleError from '../utils/error_handler.js';

dotenv.config(); // Load environment variables

const connectDB = asyncHandler(async (res) => {
  const mongoURI = `${process.env.MONGO_URL}/surify`;

  const conn = await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.name}`);
});

// Export a function to connect and handle specific errors
export const connectDatabaseWithErrorHandling = (res) => {
  return connectDB(res).catch((error) => {
    // Handle specific database errors using handleError
    if (error.name === 'MongoNetworkError') {
      return handleError(res, 503, 'Database connection failed. Please try again later.');
    }
    if (error.name === 'MongooseError') {
      return handleError(res, 500, 'An internal database error occurred.');
    }
    // For any other errors
    return handleError(res, 500, 'Unexpected error connecting to the database.');
  });
};

export default connectDB;