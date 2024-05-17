import { Router } from 'express';
import { Pool } from 'pg';

const gameResultRoutes = (pool: Pool) => {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const { userId, score } = req.body;
      const result = await pool.query(
        'INSERT INTO game_results (user_id, score) VALUES ($1, $2) RETURNING id',
        [userId, score]
      );
      const gameResultId = result.rows[0].id;
      res.status(201).send({ message: 'Game result submitted successfully', gameResultId });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: error.message });
          } else {
            res.status(500).send({ error: 'Unknown error' });
          }
    }
  });

  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM game_results');
      res.status(200).json(result.rows);
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).send({ error: error.message });
        } else {
          res.status(500).send({ error: 'Unknown error' });
        }
      }
  });

  return router;
};

export default gameResultRoutes;
