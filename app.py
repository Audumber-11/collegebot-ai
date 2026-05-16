import os
import json
import sys
import requests
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Set stdout to UTF-8 to handle emoji output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure OpenRouter API (MiniMax model)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "minimax/minimax-m1"

if OPENROUTER_API_KEY:
    print("[OK] OpenRouter API key loaded successfully! (MiniMax model)")
else:
    print("[WARNING] No API key found! Add OPENROUTER_API_KEY to your .env file.")


def load_college_faq():
    """Load the college FAQ knowledge base from JSON file."""
    faq_path = os.path.join(os.path.dirname(__file__), "data", "college_faq.json")
    try:
        with open(faq_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print("[WARNING] FAQ data file not found!")
        return []


def build_faq_context(faq_data):
    """Convert FAQ JSON into a readable context string for the AI."""
    context = "COLLEGE KNOWLEDGE BASE:\n\n"
    for category in faq_data:
        context += f"=== {category['category']} ===\n"
        for item in category["questions"]:
            context += f"Q: {item['q']}\nA: {item['a']}\n\n"
    return context


def search_faq_fallback(user_message):
    """Search FAQ locally using keyword matching — used when API quota is exceeded."""
    faq_data = load_college_faq()
    user_lower = user_message.lower()

    best_match = None
    best_score = 0

    for category in faq_data:
        for item in category["questions"]:
            q_lower = item["q"].lower()
            a_lower = item["a"].lower()
            score = 0
            # Score based on word overlap
            for word in user_lower.split():
                if len(word) > 3:
                    if word in q_lower:
                        score += 3
                    if word in a_lower:
                        score += 1

            if score > best_score:
                best_score = score
                best_match = item

    if best_match and best_score >= 3:
        return f"{best_match['a']}\n\n*(Answered from college knowledge base)*"
    return (
        "I'm sorry, I couldn't find a specific answer for that. "
        "Please contact the college office at admin@college.edu.in or visit during office hours (9:30 AM - 5:00 PM)."
    )


def get_ai_response(user_message, chat_history):
    """Get response from MiniMax via OpenRouter API with college FAQ context."""
    if not OPENROUTER_API_KEY:
        return (
            "AI is not configured. Please add your OPENROUTER_API_KEY to the .env file."
        )

    # Load and format college FAQ as context
    faq_data = load_college_faq()
    faq_context = build_faq_context(faq_data)

    # System prompt
    system_prompt = f"""You are CollegeBot AI, a friendly and helpful assistant for a BCA college.
Your job is to answer questions about the college using the knowledge base provided below.

INSTRUCTIONS:
- Answer questions clearly and helpfully in 2-4 sentences
- If the question is in the knowledge base, use that information accurately
- If you don't know something specific, say "I don't have that specific information. Please contact the college office."
- Be friendly, professional, and supportive
- Use emojis occasionally to be engaging (but not too many)
- If a student seems stressed (exam, results, fees), add an encouraging note
- For completely unrelated questions, politely redirect the user back to college topics

{faq_context}"""

    # Build messages array for OpenAI-compatible API
    messages = [{"role": "system", "content": system_prompt}]

    # Add last 6 history messages for context
    for msg in chat_history[-6:]:
        role = "user" if msg["role"] == "user" else "assistant"
        messages.append({"role": role, "content": msg["content"]})

    # Add current user message
    messages.append({"role": "user", "content": user_message})

    try:
        response = requests.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "CollegeBot AI"
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": messages,
                "max_tokens": 512,
                "temperature": 0.7
            },
            timeout=30
        )
        data = response.json()

        if response.status_code == 200:
            return data["choices"][0]["message"]["content"].strip()
        elif response.status_code == 402:
            # Fallback to local FAQ search if out of credits
            print("[WARNING] OpenRouter out of credits, falling back to FAQ search.")
            return search_faq_fallback(user_message)
        else:
            error_msg = data.get("error", {}).get("message", "Unknown error")
            print(f"[ERROR] OpenRouter: {error_msg}")
            return search_faq_fallback(user_message)

    except requests.exceptions.Timeout:
        return "⚠️ The AI took too long to respond. Please try again."
    except Exception as e:
        print(f"[ERROR] {e}")
        return search_faq_fallback(user_message)


@app.route("/")
def index():
    """Serve the main chat interface."""
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    """Handle chat messages and return AI response."""
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"error": "No message provided", "status": "error"}), 400

    user_message = data.get("message", "").strip()
    chat_history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "Empty message", "status": "error"}), 400

    ai_response = get_ai_response(user_message, chat_history)
    return jsonify({"response": ai_response, "status": "success"})


@app.route("/health")
def health():
    """Health check endpoint."""
    api_status = "configured" if model else "not configured"
    return jsonify({
        "status": "running",
        "api": api_status,
        "message": "CollegeBot AI is live!"
    })


if __name__ == "__main__":
    print("=" * 52)
    print("  CollegeBot AI -- Starting Server...")
    print("=" * 52)
    if not OPENROUTER_API_KEY:
        print("  [!] No API key set.")
        print("  [1] Get a key: https://openrouter.ai/settings/keys")
        print("  [2] Open .env file in the chatbot folder")
        print("  [3] Set: OPENROUTER_API_KEY=your_key_here")
        print("  [4] Restart this server")
        print()
        print("  The app will still run using local FAQ fallback.")
    else:
        print(f"  [OK] Using model: {OPENROUTER_MODEL}")
    print("  Open browser: http://localhost:5000")
    print("=" * 52)
    app.run(debug=True, host="0.0.0.0", port=5000)
