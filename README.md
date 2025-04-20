# AI Recipe Backend

This is a simple Node.js + Express API that uses the Groq LLM to generate recipes

## How to Use the API

**POST** `https://ai-recipe-backend-15no.onrender.com/api/recipe`

### Request Body (JSON)
```json
{
  "ingredients": "chicken, rice, broccoli, garlic"
}
