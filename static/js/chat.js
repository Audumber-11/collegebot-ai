/* =============================================
   CollegeBot AI — Chat Logic & Interactions
   ============================================= */

// ─── State ──────────────────────────────────────
let chatHistory = [];
let messageCount = 0;
let isTyping = false;

// ─── DOM Elements ───────────────────────────────
const chatMessages     = document.getElementById('chatMessages');
const userInput        = document.getElementById('userInput');
const sendBtn          = document.getElementById('sendBtn');
const charCount        = document.getElementById('charCount');
const messageCountEl   = document.getElementById('messageCount');
const welcomeScreen    = document.getElementById('welcomeScreen');
const newChatBtn       = document.getElementById('newChatBtn');
const clearChatBtn     = document.getElementById('clearChatBtn');
const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
const sidebarOverlay   = document.getElementById('sidebarOverlay');
const sidebar          = document.querySelector('.sidebar');

// ─── Helpers ────────────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatBotText(text) {
  // Bold: **text**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Line breaks
  text = text.replace(/\n/g, '<br>');
  // Bullet points
  text = text.replace(/^• (.+)/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  return text;
}

function scrollToBottom(smooth = true) {
  chatMessages.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: smooth ? 'smooth' : 'instant'
  });
}

function updateMessageCount() {
  messageCountEl.textContent = messageCount;
}

function hideWelcomeScreen() {
  if (welcomeScreen && welcomeScreen.parentNode === chatMessages) {
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'translateY(-10px)';
    welcomeScreen.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (welcomeScreen.parentNode) welcomeScreen.remove();
    }, 300);
  }
}

// ─── Render User Message ────────────────────────
function renderUserMessage(text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper user';
  wrapper.innerHTML = `
    <span class="message-time">${getTime()}</span>
    <div class="bubble user">${escapeHTML(text)}</div>
    <div class="avatar user">👤</div>
  `;
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

// ─── Render Bot Message ─────────────────────────
function renderBotMessage(text, isError = false) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper';
  const bubbleClass = isError ? 'bubble bot error' : 'bubble bot';
  wrapper.innerHTML = `
    <div class="avatar bot">🤖</div>
    <div class="${bubbleClass}">${formatBotText(escapeHTML(text).replace(/&lt;br&gt;/g, '<br>'))}</div>
    <span class="message-time">${getTime()}</span>
  `;
  // Typewriter effect for non-error messages
  if (!isError) {
    const bubbleEl = wrapper.querySelector('.bubble');
    const finalHTML = formatBotText(text);
    bubbleEl.innerHTML = '';
    chatMessages.appendChild(wrapper);
    scrollToBottom();
    typewriterHTML(bubbleEl, finalHTML, 0);
  } else {
    chatMessages.appendChild(wrapper);
    scrollToBottom();
  }
}

// Typewriter effect
function typewriterHTML(el, html, delay = 0) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const text = temp.textContent;
  let i = 0;
  el.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      // Re-apply formatting every few chars to handle mid-word bold etc
      if (i % 10 === 0 || i === text.length) {
        el.innerHTML = formatBotText(text.substring(0, i));
      }
      scrollToBottom();
      setTimeout(type, 12);
    } else {
      el.innerHTML = formatBotText(text);
      scrollToBottom();
    }
  }
  setTimeout(type, delay);
}

// ─── Typing Indicator ───────────────────────────
function showTypingIndicator() {
  hideTypingIndicator();
  const wrapper = document.createElement('div');
  wrapper.className = 'typing-wrapper';
  wrapper.id = 'typingIndicator';
  wrapper.innerHTML = `
    <div class="avatar bot">🤖</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

function hideTypingIndicator() {
  const existing = document.getElementById('typingIndicator');
  if (existing) existing.remove();
}

// ─── Send Message ───────────────────────────────
async function sendMessage(text) {
  const messageText = (text || userInput.value).trim();
  if (!messageText || isTyping) return;

  // Hide welcome, clear input
  hideWelcomeScreen();
  userInput.value = '';
  charCount.textContent = '0/500';
  autoResizeTextarea();

  // Render user bubble
  renderUserMessage(messageText);
  messageCount++;
  updateMessageCount();

  // Push to history
  chatHistory.push({ role: 'user', content: messageText });

  // Lock UI
  isTyping = true;
  sendBtn.disabled = true;
  sendBtn.classList.add('loading');
  showTypingIndicator();

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText, history: chatHistory }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    hideTypingIndicator();

    if (data.status === 'success') {
      renderBotMessage(data.response);
      chatHistory.push({ role: 'bot', content: data.response });
    } else {
      renderBotMessage('⚠️ Something went wrong. Please try again.', true);
    }
  } catch (err) {
    hideTypingIndicator();
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      renderBotMessage('⚠️ Cannot connect to the server. Make sure the Flask app is running (python app.py).', true);
    } else {
      renderBotMessage(`⚠️ Error: ${err.message}`, true);
    }
  } finally {
    isTyping = false;
    sendBtn.disabled = false;
    sendBtn.classList.remove('loading');
    userInput.focus();
  }
}

// ─── Textarea Auto-resize ───────────────────────
function autoResizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
}

// ─── Clear / New Chat ───────────────────────────
function clearChat() {
  chatHistory = [];
  messageCount = 0;
  updateMessageCount();

  // Remove all messages and re-add welcome
  chatMessages.innerHTML = '';
  chatMessages.appendChild(createWelcomeScreen());
}

function createWelcomeScreen() {
  const div = document.createElement('div');
  div.id = 'welcomeScreen';
  div.className = 'welcome-screen';
  div.innerHTML = `
    <div class="welcome-emoji">🎓</div>
    <h2 class="welcome-title">Welcome to CollegeBot AI!</h2>
    <p class="welcome-sub">I know everything about your college — admissions, fees, exams, placements, facilities and more. Ask me anything!</p>
    <div class="suggestion-grid">
      <button class="suggestion-card" data-q="How do I get admitted to BCA?">
        <span class="sug-icon">📋</span><span class="sug-text">How to get admitted?</span>
      </button>
      <button class="suggestion-card" data-q="What documents are required for admission?">
        <span class="sug-icon">📄</span><span class="sug-text">Documents needed?</span>
      </button>
      <button class="suggestion-card" data-q="What is the total fee for BCA?">
        <span class="sug-icon">💰</span><span class="sug-text">What is the fee?</span>
      </button>
      <button class="suggestion-card" data-q="What companies visit for campus placement?">
        <span class="sug-icon">💼</span><span class="sug-text">Campus placement?</span>
      </button>
    </div>
  `;
  // Re-attach suggestion events
  div.querySelectorAll('.suggestion-card').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.dataset.q));
  });
  return div;
}

// ─── Mobile Sidebar ─────────────────────────────
function openSidebar() {
  sidebar.classList.add('mobile-open');
  sidebarOverlay.classList.add('active');
}
function closeSidebar() {
  sidebar.classList.remove('mobile-open');
  sidebarOverlay.classList.remove('active');
}

// ─── Event Listeners ────────────────────────────

// Send on button click
sendBtn.addEventListener('click', () => sendMessage());

// Send on Enter (Shift+Enter = newline)
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Char counter + auto-resize
userInput.addEventListener('input', () => {
  charCount.textContent = `${userInput.value.length}/500`;
  autoResizeTextarea();
});

// Topic buttons (sidebar)
document.getElementById('topicList').addEventListener('click', (e) => {
  const btn = e.target.closest('.topic-btn');
  if (btn) {
    sendMessage(btn.dataset.q);
    closeSidebar();
  }
});

// Quick chips
document.getElementById('quickChips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (chip) sendMessage(chip.dataset.q);
});

// Suggestion cards on welcome screen (static ones)
document.querySelectorAll('.suggestion-card').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});

// New chat & clear
newChatBtn.addEventListener('click', () => { clearChat(); closeSidebar(); });
clearChatBtn.addEventListener('click', clearChat);

// Mobile sidebar
mobileSidebarToggle.addEventListener('click', openSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// ─── Init ────────────────────────────────────────
userInput.focus();
console.log('%c🤖 CollegeBot AI loaded!', 'color: #7c3aed; font-weight: bold; font-size: 14px;');
