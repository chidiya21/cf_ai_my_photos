import { html } from 'hono/html';

interface LayoutProps {
  children: any;
  title?: string;
  activePage?: 'writing' | 'pages' | 'recordings' | 'chat' | 'profile';
}

export const Layout = ({ children, title = 'Songbook', activePage }: LayoutProps) => {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
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
      font-size: 2rem;
      color: white;
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

    /* Chat bubble floating button */
    .chat-bubble {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow-subtle);
      transition: transform 0.2s;
      z-index: 1000;
    }

    .chat-bubble:hover {
      transform: scale(1.1);
    }

    .chat-bubble svg {
      width: 30px;
      height: 30px;
      fill: var(--bg-dark);
    }

    /* Chat drawer */
    .chat-drawer {
      position: fixed;
      right: -400px;
      top: 0;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: -4px 0 12px var(--shadow-subtle);
      transition: right 0.3s ease;
      z-index: 999;
      display: flex;
      flex-direction: column;
    }

    .chat-drawer.open {
      right: 0;
    }

    .chat-drawer-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-drawer-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .chat-drawer-input {
      padding: 1rem;
      border-top: 1px solid #e5e5e5;
    }

    .chat-drawer-input textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      font-family: inherit;
      resize: none;
    }

    .chat-drawer-input button {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.75rem;
      background: var(--bg-dark);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
    }

    .message {
      margin-bottom: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
    }

    .message.user {
      background: #f0f0f0;
      margin-left: 2rem;
    }

    .message.assistant {
      background: var(--paper-yellow);
      margin-right: 2rem;
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo">🎵</div>
    <ul class="nav-links">
      <li><a href="/writing" class="${activePage === 'writing' ? 'active' : ''}">Writing</a></li>
      <li><a href="/pages" class="${activePage === 'pages' ? 'active' : ''}">Pages</a></li>
      <li><a href="/recordings" class="${activePage === 'recordings' ? 'active' : ''}">Recordings</a></li>
      <li><a href="/chat" class="${activePage === 'chat' ? 'active' : ''}">Chat</a></li>
      <li><a href="/profile" class="${activePage === 'profile' ? 'active' : ''}">Profile</a></li>
    </ul>
  </nav>

  <main>
    ${children}
  </main>

  <!-- Floating chat bubble -->
  <div class="chat-bubble" onclick="toggleChatDrawer()">
    <svg viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  </div>

  <!-- Chat drawer -->
  <div class="chat-drawer" id="chatDrawer">
    <div class="chat-drawer-header">
      <h3>AI Co-Writer</h3>
      <button onclick="toggleChatDrawer()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
    </div>
    <div class="chat-drawer-messages" id="chatMessages">
      <!-- Messages will be inserted here -->
    </div>
    <div class="chat-drawer-input">
      <textarea id="chatInput" placeholder="Ask for help with lyrics, rhymes, ideas..." rows="3"></textarea>
      <button onclick="sendMessage()">Send</button>
    </div>
  </div>

  <script>
    function toggleChatDrawer() {
      const drawer = document.getElementById('chatDrawer');
      drawer.classList.toggle('open');
    }

    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const messagesContainer = document.getElementById('chatMessages');
      const message = input.value.trim();

      if (!message) return;

      // Add user message to UI
      const userMsg = document.createElement('div');
      userMsg.className = 'message user';
      userMsg.textContent = message;
      messagesContainer.appendChild(userMsg);

      input.value = '';

      // Send to API
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Add assistant response
        const assistantMsg = document.createElement('div');
        assistantMsg.className = 'message assistant';
        assistantMsg.textContent = data.response;
        messagesContainer.appendChild(assistantMsg);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    // Allow Enter to send (Shift+Enter for new line)
    document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  </script>
</body>
</html>`;
};
