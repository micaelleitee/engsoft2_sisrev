import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth.routes';
import { laboratoryRoutes } from './routes/laboratory.routes';
import { reservationRoutes } from './routes/reservation.routes';
import { userRoutes } from './routes/user.routes';
import { notificationRoutes } from './routes/notification.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Em desenvolvimento, permitir todas as origens
    if (process.env.NODE_ENV === 'development' || !process.env.CORS_ORIGIN) {
      return callback(null, true);
    }
    
    // Em produção, verificar a lista de origens permitidas
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim().replace(/^["']|["']$/g, '')) || [];
    
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SISREV API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/laboratories', laboratoryRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Accessible at http://localhost:${PORT}`);
});

