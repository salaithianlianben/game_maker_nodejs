import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import agentRoutes from './routes/agent.routes';
import paymentRoutes from './routes/payment.routes';
import ownerRoutes from './routes/owner.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: ['https://your-frontend-domain.com'], credentials: true }));
app.use(helmet());
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', agentRoutes);
app.use('/api', ownerRoutes);

app.disable('x-powered-by');

export default app;
