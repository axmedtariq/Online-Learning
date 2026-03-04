const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
require('dotenv').config({ path: '../.env' });
const { loadVaultSecrets } = require('./config/vault');
const { sanitizeInput } = require('./utils/security');
const logger = require('./utils/logger');

const app = express();

// 1. Military Grade Security Headers (Helmet)
app.use(helmet());

// Logging: Combined Morgan into Winston (Elasticsearch Ready)
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// 2. Global Input Sanitization Middleware
app.use((req, res, next) => {
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
app.use(cors());

// Monitoring & Metrics
const { metricsMiddleware, getMetrics } = require('./middleware/monitoring');
app.use(metricsMiddleware);
app.get('/metrics', getMetrics);

// Special middleware for webhook (raw body needed)
const paymentWebhook = require('./Routes/payementRoute');
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentWebhook);

const startServer = async () => {
    try {
        // 1. Load Secrets from HashiCorp Vault
        await loadVaultSecrets();

        // 2. Import routes and database (after secrets are loaded into process.env)
        const { sequelize } = require('./models');
        const authRoutes = require('./Routes/authRoute');
        const adminRoutes = require('./Routes/adminRoute');
        const courseRoutes = require('./Routes/courseRoute');
        const paymentRoutes = require('./Routes/payment');

        // 3. Register Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/courses', courseRoutes);
        app.use('/api/payment', paymentRoutes);

        // --- GLOBAL SECURITY ERROR HANDLER ---
        app.use((err, req, res, next) => {
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

        console.log("✅ SQL Server Database synchronized.");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();