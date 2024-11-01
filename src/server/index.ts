import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { roomRouter } from './routes/rooms';
import { reservationRouter } from './routes/reservations';
import { holidayRouter } from './routes/holidays';
import { userRouter } from './routes/users';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/rooms', authenticateToken, roomRouter);
app.use('/api/reservations', authenticateToken, reservationRouter);
app.use('/api/holidays', authenticateToken, holidayRouter);
app.use('/api/users', authenticateToken, userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});