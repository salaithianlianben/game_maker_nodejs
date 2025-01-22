import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import setupSwagger from './config/swaggerConfig';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import agentRoutes from './routes/agent.routes';
import paymentRoutes from './routes/payment.routes';
import ownerRoutes from './routes/owner.routes';

dotenv.config();

const app = express();

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());

// Routes Setup
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', agentRoutes);
app.use('/api', ownerRoutes)

// Swagger Setup
setupSwagger(app);

export default app;
