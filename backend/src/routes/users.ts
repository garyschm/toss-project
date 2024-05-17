import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const userRoutes = (pool: Pool) => {
  const router = Router();

  router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
        [username, email, hashedPassword]
      );

      const userId = result.rows[0].id;
      res.status(201).send({ message: 'User registered successfully', userId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  return router;
};

export default userRoutes;
