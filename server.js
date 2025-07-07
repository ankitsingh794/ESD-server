const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();

// ✅ Enable CORS for your deployed frontend
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://empower-hub.vercel.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.options("*", cors()); // handle preflight


app.use(express.json());

// ✅ Set up OpenAI with OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://empower-hub.vercel.app", // 🔁 Update to deployed frontend
    "X-Title": "EmpowerHub AI Assistant",
  },
});

// ✅ Main AI Assistant endpoint
app.post("/ai-assist", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
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
    console.error("❌ OpenRouter error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to respond." });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AI Assistant API running on http://localhost:${PORT}`);
});
