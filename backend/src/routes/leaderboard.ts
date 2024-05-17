import { Router } from 'express';
import { Pool } from 'pg';

const leaderboardRoutes = (pool: Pool) => {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM leaderboard');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  return router;
};

export default leaderboardRoutes;
