import express from 'express';
//import { Pool } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// //probably don't need to use anymore (set up for PostGre SQL?)
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



// Routes
import userRoutes from './routes/users';
//import gameResultRoutes from './routes/gameResults';
//import leaderboardRoutes from './routes/leaderboard';
import authRoutes from './routes/auth';

app.use('/api/users', userRoutes);
//app.use('/api/game-results', gameResultRoutes(pool));
//app.use('/api/leaderboard', leaderboardRoutes(pool));
app.use('/api/auth', authRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
