import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productsRouter from './routes/products.js';

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const mongoUri = process.env.MONGODB_URI || (isProduction ? '' : 'mongodb://127.0.0.1:27017/stockroom');
const frontendUrl = process.env.FRONTEND_URL || (isProduction ? '' : 'http://localhost:5173');

if (!mongoUri) {
  console.error('MONGODB_URI must be set in production.');
  process.exit(1);
}
if (!frontendUrl) {
  console.error('FRONTEND_URL must be set in production.');
  process.exit(1);
}

const allowedOrigins = frontendUrl
  .split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('This frontend origin is not allowed by the API.'));
  }
}));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/products', productsRouter);
app.use((error, _req, res, _next) => {
  if (error.message === 'This frontend origin is not allowed by the API.') {
    return res.status(403).json({ message: error.message });
  }
  if (error.code === 11000) return res.status(409).json({ message: 'That SKU is already in use.' });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: error.message });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});
try {
  await mongoose.connect(mongoUri);
  app.listen(port, () => console.log(`Stockroom is running on http://localhost:${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
