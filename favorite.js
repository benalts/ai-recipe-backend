import express from 'express';
import pool from './db.js';

const router = express.Router();

//correctness check
router.get('/favorite', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'running favorite.js, DB connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'DB not connected', error: err.message });
  }
});

//read record
router.get('/read', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const result = await pool.query(
      'SELECT id, title, recipe_json, created_at FROM favorite_recipes WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json({ favorites: result.rows });
  } catch (err) {
    console.error('Error reading favorites:', err);
    res.status(500).json({ error: 'Failed to read favorites' });
  }
});

// insert record
router.post('/create', async (req, res) => {
  const { user_id, title, recipe_json } = req.body;

  if (!user_id || !title || !recipe_json) {
    return res.status(400).json({ error: 'Missing required fields: user_id, title, recipe_json' });
  }

  try {
    await pool.query(
      'INSERT INTO favorite_recipes (user_id, title, recipe_json) VALUES ($1, $2, $3)',
      [user_id, title, recipe_json]
    );
    res.status(201).json({ message: 'Favorite recipe saved successfully' });
  } catch (err) {
    console.error('Error inserting favorite recipe:', err);
    res.status(500).json({ error: 'Failed to save favorite recipe' });
  }
});

//delete record
router.delete('/delete', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing favorite recipe id' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM favorite_recipes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Favorite recipe not found' });
    }

    res.json({ message: 'Favorite recipe deleted successfully', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting favorite recipe:', err);
    res.status(500).json({ error: 'Failed to delete favorite recipe' });
  }
});

export default router;
