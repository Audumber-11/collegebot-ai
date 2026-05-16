# 📋 PRD — AI College FAQ Chatbot
**Product Requirements Document**
**Version:** 1.0 | **Date:** April 2026 | **Author:** BCA 2nd Year Portfolio Project

---

## 1. Product Overview

### 1.1 Product Name
**CollegeBot AI** — An Intelligent College FAQ Assistant

### 1.2 Problem Statement
Students, parents, and staff constantly ask repetitive questions about:
- Admission procedures and deadlines
- Fee structure and scholarships
- Exam schedules and result dates
- Hostel, library, and lab facilities
- Faculty contact information
- Placement and internship queries

Currently these questions flood the admin office, WhatsApp groups, and college websites with no 24×7 intelligent support.

### 1.3 Solution
A **RAG-based AI Chatbot** powered by Google Gemini API that:
- Understands natural language questions
- Searches through a college knowledge base (FAQ data)
- Gives accurate, conversational answers instantly
- Is available 24×7 on any device

---

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Answer 90%+ common college questions | User satisfaction rating |
| Under 3 second response time | API latency measured |
| Works on mobile + desktop | Responsive design |
| Easy to update FAQ knowledge base | JSON-based data file |

---

## 3. Target Users

| User | Use Case |
|------|----------|
| **New Students** | Admission queries, fee payment, document submission |
| **Current Students** | Exam dates, results, library hours, lab schedules |
| **Parents** | Fee structure, hostel facilities, placement stats |
| **Visitors** | College info, contact details, location |

---

## 4. Feature Requirements

### 4.1 Core Features (Must Have)
- [x] **Natural Language Chat Interface** — Ask questions in plain English/Hindi
- [x] **Google Gemini AI Integration** — Real AI responses, not just keyword matching
- [x] **College Knowledge Base** — Pre-loaded FAQ data (JSON format)
- [x] **Chat History** — Conversation persists within the session
- [x] **Typing Indicator** — "Bot is typing..." animation for UX
- [x] **Quick Question Chips** — Click to ask common questions instantly
- [x] **Responsive Design** — Works on mobile + desktop
- [x] **Dark Mode UI** — Modern, premium glassmorphism design

### 4.2 Nice to Have (Future Scope)
- [ ] Multi-language support (Hindi/Marathi)
- [ ] PDF upload for college documents
- [ ] Admin panel to update FAQ
- [ ] Voice input support
- [ ] Email escalation if bot can't answer

---

## 5. Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                  USER BROWSER                        │
│    Chrome / Firefox / Mobile Browser                 │
└─────────────────────┬───────────────────────────────┘
                       │ HTTP Request (user message)
                       ▼
┌─────────────────────────────────────────────────────┐
│              FLASK BACKEND (app.py)                  │
│  • Receives user message via /chat API endpoint      │
│  • Loads college FAQ from data/college_faq.json      │
│  • Builds system prompt with FAQ context             │
│  • Calls Google Gemini API                           │
│  • Returns AI response as JSON                       │
└────────────────────┬────────────────────────────────┘
                      │ Gemini API Call
                      ▼
┌─────────────────────────────────────────────────────┐
│            GOOGLE GEMINI API                         │
│  • Model: gemini-1.5-flash (free tier)               │
│  • Gets FAQ context + user question                  │
│  • Returns intelligent, contextual answer            │
└─────────────────────────────────────────────────────┘
```

### 5.1 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | HTML5 + CSS3 + Vanilla JS | Lightweight, no framework needed |
| **Backend** | Python + Flask | Simple, fast, well-supported |
| **AI Model** | Google Gemini 1.5 Flash | Free tier, fast, multilingual |
| **Knowledge Base** | JSON file | Easy to read, edit, update |
| **Deployment** | Render / Railway | Free hosting, easy deploy |

### 5.2 Project File Structure
```
chatbot/
├── PRD.md                  ← This file
├── app.py                  ← Flask backend + Gemini API logic
├── requirements.txt        ← Python dependencies
├── .env.example            ← API key template (commit this)
├── .env                    ← Your real API key (DO NOT commit)
├── README.md               ← Setup instructions
├── data/
│   └── college_faq.json    ← College knowledge base
├── templates/
│   └── index.html          ← Main chat UI page
└── static/
    ├── css/
    │   └── style.css       ← All styling (glassmorphism dark theme)
    └── js/
        └── chat.js         ← Chat logic, API calls, animations
```

---

## 6. UI/UX Requirements

| Requirement | Detail |
|-------------|--------|
| **Theme** | Dark mode with purple/blue gradient accents |
| **Style** | Glassmorphism cards, smooth animations |
| **Font** | Inter (Google Fonts) |
| **Colors** | Background: #0a0a1a \| Accent: #7c3aed (purple) \| Chat blue: #2563eb |
| **Animations** | Typing indicator dots, message slide-in, hover effects |
| **Mobile** | Fully responsive, touch-friendly |

---

## 7. API Design

### POST /chat
**Request:**
```json
{
  "message": "What are the admission requirements?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "bot", "content": "Hi! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "response": "To get admitted to our college, you need...",
  "status": "success"
}
```

---

## 8. Setup & Installation

### Prerequisites
- Python 3.9+
- Google Gemini API Key (free at aistudio.google.com)

### Steps
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Add your API key
copy .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here

# 3. Run the app
python app.py

# 4. Open browser
# Go to: http://localhost:5000
```

---

## 9. Timeline (For Resume)

| Milestone | Day |
|-----------|-----|
| PRD + Project Setup | Day 1 |
| Knowledge Base + Backend | Day 2 |
| Frontend UI | Day 3 |
| Integration + Testing | Day 4 |
| Deployment + README | Day 5 |

---

## 10. Resume Points (Copy-Paste Ready)

```
• Built an AI-powered College FAQ Chatbot using Python (Flask) and Google Gemini API
• Implemented RAG-based architecture feeding college knowledge base as context to LLM
• Designed responsive dark-mode UI with glassmorphism styling and typing animations
• Deployed live on Render with REST API backend handling natural language queries
• Reduced repetitive admin queries by providing 24/7 intelligent student support
```

---

*PRD Version 1.0 | CollegeBot AI | BCA Portfolio Project 2026*
