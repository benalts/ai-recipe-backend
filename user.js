import express from 'express';
import pool from './db.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, password]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'User account created successfully',
      user: user
    });
  } catch (err) {
    console.error('Error creating user:', err);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }

    res.status(500).json({ error: 'Failed to create user account' });
  }
});

export default router;
