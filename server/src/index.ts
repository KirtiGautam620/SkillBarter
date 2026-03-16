const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

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


app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'OK', message: 'SkillBarter Backend Ready' });
});

import authRoutes from './routes/authRoutes';
import swapRoutes from './routes/swapRoutes';
import skillRoutes from './routes/skillRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/skills', skillRoutes);

app.listen(PORT, () => {
  console.log(`SkillBarter Server running on port ${PORT}`);
});
