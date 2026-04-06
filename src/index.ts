import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import router from './routes.js';
import { sendError } from './utils/apiResponse.js';
import { errorHandler } from './middleware/errorHandler.js';
const app = express();
const PORT = process.env.PORT || 3000;

// Core Middleware 
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many login attempts, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health Check
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Finance Dashboard API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API Routes
app.use('/api', router);

// 404 Handler
app.use((_req, res) => {
    sendError(res, 'Route not found', 404);
});

//global catch
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
});

export default app;
