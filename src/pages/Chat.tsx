import { html } from 'hono/html';

export const ChatPage = () => {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat - Songbook</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg-dark: #3d3232;
      --paper-cream: #f5f0e8;
      --paper-yellow: #fef9c3;
      --text-dark: #2c2c2c;
      --nav-inactive: #8b7b7b;
      --spiral-metal: #5a5a5a;
      --shadow-subtle: rgba(0, 0, 0, 0.15);
    }

    body {
      font-family: 'Courier New', monospace;
      background: var(--bg-dark);
      color: var(--text-dark);
      min-height: 100vh;
    }

    /* Navigation */
    nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 1rem 2rem;
      background: var(--bg-dark);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .logo {
      position: absolute;
      left: 2rem;
      width: 50px;
      height: 50px;
    }

    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      color: var(--nav-inactive);
      text-decoration: none;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      transition: all 0.3s;
      font-size: 0.95rem;
    }

    .nav-links a.active {
      background: var(--paper-cream);
      color: var(--text-dark);
    }

    .nav-links a:hover:not(.active) {
      color: white;
    }

    /* Main content area */
    main {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .chat-page {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px var(--shadow-subtle);
    }

    .chat-header {
      padding: 1.5rem;
      border-bottom: 2px solid #e5e5e5;
    }

    .chat-header h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .chat-header p {
      color: #666;
      font-size: 0.9rem;
    }

    .chat-history {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }

    .chat-message {
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .message-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #666;
    }

    .message-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .message-avatar.user {
      background: #e5e5e5;
    }

    .message-avatar.assistant {
      background: var(--paper-yellow);
    }

    .message-content {
      padding: 1rem 1.5rem;
      border-radius: 12px;
      white-space: pre-wrap;
      line-height: 1.6;
    }

    .message-content.user {
      background: #f5f5f5;
      margin-left: 2.5rem;
    }

    .message-content.assistant {
      background: var(--paper-yellow);
      margin-left: 2.5rem;
    }

    .chat-input-area {
      padding: 1.5rem;
      border-top: 2px solid #e5e5e5;
      background: #fafafa;
    }

    .chat-input-container {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }

    .chat-input-container textarea {
      flex: 1;
      padding: 1rem;
      border: 2px solid #e5e5e5;
      border-radius: 12px;
      font-family: 'Courier New', monospace;
      font-size: 0.95rem;
      resize: none;
      min-height: 60px;
      max-height: 150px;
    }

    .chat-input-container button {
      padding: 1rem 2rem;
      background: var(--bg-dark);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.95rem;
      transition: background 0.2s;
    }

    .chat-input-container button:hover {
      background: #2a2020;
    }

    .chat-input-container button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
    }

    .empty-state h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #666;
    }

    .suggested-prompts {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 2rem;
    }

    .prompt-card {
      padding: 1rem;
      background: white;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .prompt-card:hover {
      border-color: var(--bg-dark);
      transform: translateY(-2px);
    }

    .prompt-card h3 {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .prompt-card p {
      font-size: 0.85rem;
      color: #666;
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo">
      <img src="/SongbookLogo.svg" alt="Songbook" />
    </div>
    <ul class="nav-links">
      <li><a href="/writing">Writing</a></li>
      <li><a href="/pages">Pages</a></li>
      <li><a href="/recordings">Recordings</a></li>
      <li><a href="/chat" class="active">Chat</a></li>
      <li><a href="/profile">Profile</a></li>
    </ul>
  </nav>

  <main>
    <div class="chat-page">
      <div class="chat-header">
        <h1>Chat</h1>
        <p>Long-form conversation history with your songwriting assistant.</p>
      </div>

      <div class="chat-history" id="chatHistory">
        <div class="empty-state" id="emptyState">
          <h2>Start a conversation</h2>
          <p>Ask me anything about songwriting, lyrics, or creative ideas</p>

          <div class="suggested-prompts">
            <div class="prompt-card" onclick="useSuggestedPrompt('Help me write a chorus about overcoming doubt')">
              <h3>🎵 Chorus Help</h3>
              <p>Get help writing a catchy chorus</p>
            </div>
            <div class="prompt-card" onclick="useSuggestedPrompt('What rhymes with \\'heart\\' that feels emotional?')">
              <h3>🔤 Find Rhymes</h3>
              <p>Discover perfect rhymes and synonyms</p>
            </div>
            <div class="prompt-card" onclick="useSuggestedPrompt('I want to write about change, give me some metaphors')">
              <h3>💡 Brainstorm Ideas</h3>
              <p>Generate creative concepts and themes</p>
            </div>
            <div class="prompt-card" onclick="useSuggestedPrompt('Rewrite this line to be more poetic: I miss you every day')">
              <h3>✨ Improve Lines</h3>
              <p>Refine and polish your lyrics</p>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <div class="chat-input-container">
          <textarea
            id="chatInput"
            placeholder="Ask about lyrics, rhymes, ideas, or anything creative..."
            rows="2"
          ></textarea>
          <button id="sendButton" onclick="sendChatMessage()">Send</button>
        </div>
      </div>
    </div>
  </main>

  <script>
    const chatHistory = document.getElementById('chatHistory');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const emptyState = document.getElementById('emptyState');

    async function loadChatHistory() {
      try {
        const response = await fetch('/api/chat/history');
        if (response.ok) {
          const messages = await response.json();
          if (messages.length > 0) {
            emptyState.style.display = 'none';
            messages.forEach(msg => addMessageToUI(msg.role, msg.content, msg.timestamp));
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }

    function addMessageToUI(role, content, timestamp) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message';

      const time = new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });

      messageDiv.innerHTML = \`
        <div class="message-meta">
          <div class="message-avatar \${role}">
            \${role === 'user' ? '👤' : '🤖'}
          </div>
          <span>\${role === 'user' ? 'You' : 'Assistant'}</span>
          <span>•</span>
          <span>\${time}</span>
        </div>
        <div class="message-content \${role}">\${content}</div>
      \`;

      if (emptyState.style.display !== 'none') {
        emptyState.style.display = 'none';
      }

      chatHistory.appendChild(messageDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    async function sendChatMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      chatInput.value = '';
      sendButton.disabled = true;

      addMessageToUI('user', message, Date.now());

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        const data = await response.json();
        addMessageToUI('assistant', data.response, Date.now());
      } catch (error) {
        console.error('Error sending message:', error);
        addMessageToUI('assistant', 'Sorry, I encountered an error. Please try again.', Date.now());
      } finally {
        sendButton.disabled = false;
        chatInput.focus();
      }
    }

    function useSuggestedPrompt(prompt) {
      chatInput.value = prompt;
      chatInput.focus();
    }

    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });

    loadChatHistory();
  </script>
</body>
</html>`;
};
