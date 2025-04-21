import express from 'express';
import pool from './db.js';

const router = express.Router();

router.get('/favorite', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'running favorite.js, DB connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'DB not connected', error: err.message });
  }
});

export default router;
