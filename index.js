import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import Groq from 'groq-sdk';
import pool from './db.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// === GROQ client setup ===
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ================================
   👤 Create User
================================== */
app.post('/user/create', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('User creation failed:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/* ================================
   🔐 Login User
================================== */
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]); // ✅ Login success
    } else {
      return res.status(401).json({ error: 'Invalid credentials' }); // ❌ Wrong email or password
    }
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

/* ================================
   🍳 Recipe Generation (AI)
================================== */
app.post('/api/recipe', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: 'Missing ingredients in request body.' });
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Using the given ingredients, write a short recipe for a dish. Start by giving the title and then a brief description and steps. Don't make the response too long. Here are my ingredients: ${ingredients}`,
        },
      ],
      model: "llama3-70b-8192",
    });

    const recipe = response.choices[0]?.message?.content || '';
    res.json({ recipe });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Failed to generate recipe.' });
  }
});

/* ================================
   🎵 Song Recommendation (AI)
================================== */
app.post('/api/song', async (req, res) => {
  const { recipe } = req.body;

  if (!recipe) {
    return res.status(400).json({ error: 'Missing recipe in request body.' });
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Here is a recipe: """${recipe}""". Based on the mood or vibe of this dish, recommend one song that fits the feeling of the meal. Include the song title, artist, and a short sentence on why it's a good match. Keep it brief and creative.`,
        },
      ],
      model: "llama3-70b-8192",
    });

    const song = response.choices[0]?.message?.content || '';
    res.json({ song });

  } catch (error) {
    console.error('Groq API error (song):', error);
    res.status(500).json({ error: 'Failed to generate song recommendation.' });
  }
});

/* ================================
   🚀 Start Server
================================== */
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
