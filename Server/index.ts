import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
// @ts-ignore
import xss from 'xss-clean';
import dotenv from 'dotenv';
import { loadVaultSecrets } from './config/vault';
import { sanitizeInput } from './utils/security';
import logger from './utils/logger';

dotenv.config({ path: '../.env' });

const app = express();

// 1. Military Grade Security Headers (Helmet)
app.use(helmet());

// Logging: Combined Morgan into Winston (Elasticsearch Ready)
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));

// 2. Global Input Sanitization Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = sanitizeInput(req.body);
    }
    next();
});

// 3. Prevent HTTP Parameter Pollution
app.use(hpp());

// 3. Data Sanitization against XSS (Cross Site Scripting)
app.use(xss());

// 4. Rate Limiting to prevent Brute Force & DoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));
// SECURITY: Restrict CORS to trusted origins only
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Monitoring & Metrics (Securely Exposed)
// @ts-ignore
const { metricsMiddleware, getMetrics } = require('./middleware/monitoring');
app.use(metricsMiddleware);
app.get('/metrics', (req, res, next) => {
    // Only allow access if requester is from local network or has a secret key
    const internalKey = req.headers['x-metrics-key'];
    if (req.ip === '127.0.0.1' || internalKey === process.env.METRICS_KEY) {
        return getMetrics(req, res);
    }
    res.status(403).json({ message: "Forbidden: Internal access only" });
});

// Special middleware for webhook (raw body needed)
// @ts-ignore
const paymentWebhook = require('./Routes/payementRoute');
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentWebhook);

const startServer = async () => {
    try {
        // 1. Load Secrets from HashiCorp Vault
        await loadVaultSecrets();

        // 2. Import routes and database (after secrets are loaded into process.env)
        // @ts-ignore
        const { sequelize } = require('./models');
        // @ts-ignore
        const authRoutes = require('./Routes/authRoute');
        // @ts-ignore
        const adminRoutes = require('./Routes/adminRoute');
        // @ts-ignore
        const courseRoutes = require('./Routes/courseRoute');
        // @ts-ignore
        const paymentRoutes = require('./Routes/payment');

        // 3. Register Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/courses', courseRoutes);
        app.use('/api/payment', paymentRoutes);

        // --- GLOBAL SECURITY ERROR HANDLER ---
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            err.statusCode = err.statusCode || 500;
            err.status = err.status || 'error';

            if (process.env.NODE_ENV === 'development') {
                res.status(err.statusCode).json({
                    status: err.status,
                    error: err,
                    message: err.message,
                    stack: err.stack
                });
            } else {
                // Production: Don't leak error details
                res.status(err.statusCode).json({
                    status: err.status,
                    message: 'Something went wrong!'
                });
            }
        });

        // 4. SQL Server Connection and Model Sync
        const PORT = process.env.PORT || 5000;
        await sequelize.sync({ alter: true });

        console.log("✅ PostgreSQL (Supabase) Database synchronized.");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();