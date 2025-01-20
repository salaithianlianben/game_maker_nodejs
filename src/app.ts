import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import setupSwagger from './config/swaggerConfig';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import agentRoutes from './routes/agent.routes';

dotenv.config();

const app = express();

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());

// Routes Setup
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', agentRoutes);

// Swagger Setup
setupSwagger(app);

export default app;
