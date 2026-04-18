import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import swapRoutes from './routes/swapRoutes';
import skillRoutes from './routes/skillRoutes';
import notificationRoutes from './routes/notificationRoutes';
import reviewRoutes from './routes/reviewRoutes';
import timeCreditRoutes from './routes/timeCreditRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'OK', message: 'SkillBarter Backend Ready' });
});

app.use('/api/auth', authRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/credits', timeCreditRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`SkillBarter Server running on port ${PORT}`);
});
