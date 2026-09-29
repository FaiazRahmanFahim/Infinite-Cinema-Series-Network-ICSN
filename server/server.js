import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '15mb' })); // Allows bulk JSON ingestion from Postman
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🎬 ICSN API Server is running smoothly',
        timestamp: new Date().toISOString()
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🎬 ICSN Backend running on http://localhost:${PORT}`);
});
