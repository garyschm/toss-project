import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
import userRoutes from './routes/users';
import gameResultRoutes from './routes/gameResults';
import leaderboardRoutes from './routes/leaderboard';

app.use('/api/users', userRoutes(pool));
app.use('/api/game-results', gameResultRoutes(pool));
app.use('/api/leaderboard', leaderboardRoutes(pool));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
