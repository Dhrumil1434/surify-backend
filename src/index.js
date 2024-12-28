import express from 'express';
import connectDB from './db/db_connect.js';
import userRoutes from './routes/user.route.js';

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
connectDB();

// Use the user routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`🗄️ Server is running at: http://localhost:${PORT}`);
});
