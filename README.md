# AI Recipe Backend

This is a simple Node.js + Express API that uses the Groq LLM to generate recipes

## How to Use the API

**POST** `https://ai-recipe-backend-15no.onrender.com/api/recipe`

**POST** `https://ai-recipe-backend-15no.onrender.com/api/song`

### Request Body (JSON)
```json
{
  "ingredients": "chicken, rice, broccoli, garlic"
}
```

## How to add User

**POST** `https://init-db-082r.onrender.com/user/create`

The example request body is:
```json
{
  "email": "test01@example.com",
  "password": "test01"
}
```

## How to add Users's Favorite Recipe

**POST** `https://init-db-082r.onrender.com/favorite/create`

The example request body is:
```json
{
  "user_id": 1,
  "title": "recipe01",
  "recipe_json": {
    "ingredients": ["egg", "tomato"],
    "steps": ["Beat eggs", "Stir-fry with tomatoes"]
  }
}
```
