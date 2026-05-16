# 🤖 CollegeBot AI

> An AI-powered college FAQ chatbot built with Python, Flask, and MiniMax AI (via OpenRouter).  
> **Built as a BCA 2nd Year Portfolio Project** — demonstrating RAG-based AI integration.

![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python) ![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask) ![MiniMax](https://img.shields.io/badge/MiniMax-AI-purple) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌐 Live Demo

> **[👉 View Live on Vercel](https://collegebot-ai.vercel.app)**

---

## ✨ Features

- 🤖 **MiniMax AI** — Natural language understanding via OpenRouter
- 📚 **RAG Architecture** — College FAQ knowledge base fed as context to the LLM
- 💬 **Chat History** — Maintains conversation context for follow-up questions
- ⚡ **Typewriter Effect** — Smooth, animated bot responses
- 🎨 **Premium Dark UI** — Glassmorphism design with animated gradients
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🏷️ **Quick Chips** — Click to ask common questions instantly
- 🔄 **Smart Fallback** — Falls back to local FAQ search if API is unavailable

---

## 🚀 Quick Start (Local)

### Step 1 — Get OpenRouter API Key
1. Go to **https://openrouter.ai/settings/keys**
2. Sign in / Sign up (free)
3. Click **"Create Key"** → Copy the key

### Step 2 — Setup Project
```bash
# Clone this repo
git clone https://github.com/YOUR_USERNAME/collegebot-ai.git
cd collegebot-ai

# Install Python dependencies
pip install -r requirements.txt

# Create your .env file
copy .env.example .env
```

### Step 3 — Add API Key
Open `.env` file and add your key:
```
OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

### Step 4 — Run!
```bash
python app.py
```
Open your browser at: **http://localhost:5000** 🎉

---

## 🏗️ Project Structure

```
chatbot/
├── app.py                  ← Flask backend + MiniMax AI (OpenRouter)
├── requirements.txt        ← Python packages
├── vercel.json             ← Vercel deployment config
├── .env.example            ← API key template
├── .env                    ← Your API key (don't share! gitignored)
├── PRD.md                  ← Product Requirements Document
├── data/
│   └── college_faq.json    ← College knowledge base (edit this!)
├── templates/
│   └── index.html          ← Chat UI
└── static/
    ├── css/style.css       ← Styling
    └── js/chat.js          ← Chat logic
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Python 3.9+ | Backend language |
| Flask 3.0 | Web framework |
| MiniMax M1 (OpenRouter) | AI language model |
| requests | HTTP calls to OpenRouter API |
| python-dotenv | Environment variables |
| HTML5 + CSS3 | Frontend structure & styling |
| Vanilla JavaScript | Chat interactions |
| Vercel | Live deployment |

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Go to **https://vercel.com** → Import Project → Select this repo
3. Add environment variable: `OPENROUTER_API_KEY` = your key
4. Click **Deploy** 🚀

---

## 📝 Customizing for Your College

Edit `data/college_faq.json` to add your college's actual information:

```json
{
  "category": "Admissions",
  "questions": [
    {
      "q": "Your question here?",
      "a": "Your answer here."
    }
  ]
}
```

---

## 📋 Resume Points (Copy-Paste)

```
• Built an AI-powered College FAQ Chatbot using Python (Flask) and MiniMax AI via OpenRouter
• Implemented RAG-based architecture, feeding college knowledge base as LLM context
• Designed responsive dark-mode UI with glassmorphism styling and typing animations
• Maintained conversation history for context-aware multi-turn dialogue
• Deployed live on Vercel with environment-variable-based API key management
```

---

## 👤 Author

**Audumber** | BCA 2nd Year | [GitHub](https://github.com/audumber) | [LinkedIn](https://linkedin.com/in/audumber)

---

*Made with ❤️ and MiniMax AI*
