const express = require('express');
const router = express.Router();
const pool = require('./db');

router.get('/favorite', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'running favorite.js, DB connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'DB not connected', error: err.message });
  }
});

module.exports = router;
