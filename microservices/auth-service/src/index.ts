import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
// @ts-ignore
const { loadVaultSecrets } = require('../../../Server/config/vault'); // Reusable vault loader
import winston from 'winston';

dotenv.config({ path: '../../../.env' });

const app = express();

// Security Hardening (OWASP Compliance)
app.use(helmet());
app.use(express.json());
app.use(cors());

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});

// Middleware for metrics & prometheus (Can be expanded later)
app.get('/health', (req, res) => res.status(200).json({ status: 'UP', service: 'auth-service' }));

const startService = async () => {
    try {
        // 1. Secrets - Sync from Vault
        await loadVaultSecrets();

        // 2. SUPABASE DB Connection initialized on first import
        // require('./config/supabase');

        // 3. Registering Microservice Routes
        // require('./routes/auth')(app);

        const PORT = process.env.AUTH_SERVICE_PORT || 5001;
        app.listen(PORT, () => console.log(`🔒 Auth Microservice running on port ${PORT}`));

    } catch (err) {
        console.error("❌ Failed to start Auth Service:", err);
        process.exit(1);
    }
};

startService();
