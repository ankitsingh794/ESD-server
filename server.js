const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // or your domain
    "X-Title": "EmpowerHub AI Assistant",
  },
});

app.post("/ai-assist", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // FREE + fast
      messages: [
        {
          role: "system",
          content: `You're a helpful AI assistant in EmpowerHub. You help users with career growth, resumes, skills, fundraising, and job/internship advice.`,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenRouter error:", err.message);
    res.status(500).json({ error: "Failed to respond." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AI Assistant API running on http://localhost:${PORT}`);
});
