import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import Groq from 'groq-sdk';

const app = express();

const port = 3000;

app.use(cors());

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  // 🔒 In a real app, you'd validate against a database.
  // For testing/demo, fake a user record:
  if (email === 'admin@admin.com' && password === 'admin') {
    return res.json({ id: 1, email });
  }

  // Optionally check other users from a real DB if added later

  return res.status(401).json({ error: 'Invalid credentials' });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});