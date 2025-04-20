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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});