import { html } from 'hono/html'; 

export const WritingPage = () => {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Writing - Songbook</title>
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

    main {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      transition: margin-right 0.3s ease;
    }

    main.sidebar-open {
      margin-right: 400px;
    }

    .notebook-container {
      max-width: 900px;
      margin: 0 auto;
      perspective: 1000px;
      position: relative;
    }

    .notebook {
      background-image: url('/SongbookBackground.svg');
      background-size: contain;
      background-position: center top;
      background-repeat: no-repeat;
      position: relative;
      width: 100%;
      aspect-ratio: 8.5 / 11;
      min-height: 600px;
    }

    .sticky-note {
      position: absolute;
      top: 10%;
      right: 15%;
      text-align: right;
      max-width: 20%;
    }

    .sticky-note input {
      font-size: clamp(12px, 1.2vw, 18px);
      background: transparent;
      border: none;
      font-family: 'Courier New', monospace;
      color: var(--text-dark);
      text-align: right;
      outline: none;
      margin-bottom: 0.25rem;
      font-weight: bold;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sticky-note .date {
      font-size: clamp(10px, 1vw, 14px);
      color: #666;
    }

    /* Save indicator - subtle, bottom center */
    .save-indicator {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      color: #999;
      background: transparent;
      padding: 0.25rem 0.5rem;
      opacity: 0.7;
      z-index: 10;
    }

    .save-indicator.saving { color: #666; }
    .save-indicator.saved { color: #4a9d5f; }

    .lyrics-editor {
      position: absolute;
      top: 20%;
      left: 16%;
      right: 10%;
      bottom: 10%;
    }

    .lyrics-editor textarea {
      font-size: clamp(12px, 1.1vw, 16px);
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      font-family: 'Courier New', monospace;
      line-height: 1.8;
      color: var(--text-dark);
      resize: none;
      outline: none;
      padding: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .lyrics-editor textarea::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }

    /* AI Chat Button */
    .ai-chat-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      background: transparent;
      border: none;
      cursor: pointer;
      z-index: 1001;
      padding: 0;
      transition: transform 0.2s, filter 0.2s, opacity 0.3s;
    }

    .ai-chat-btn.hidden { opacity: 0; pointer-events: none; }
    .ai-chat-btn:hover { transform: scale(1.1); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }

    .ai-chat-btn img { width: 100%; height: 100%; object-fit: contain; }

    /* Chat Sidebar */
    .chat-sidebar {
      position: fixed;
      right: -400px;
      top: 0;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: -4px 0 20px rgba(0,0,0,0.2);
      transition: right 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .chat-sidebar.open { right: 0; }

    .chat-sidebar-header {
      padding: 1.5rem;
      border-bottom: 2px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-yellow);
    }

    .chat-sidebar-header h3 { font-size: 1.1rem; color: var(--text-dark); }

    .close-chat-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-dark);
      padding: 0.25rem;
      line-height: 1;
    }

    .close-chat-btn:hover { color: #666; }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background: #fafafa;
    }

    .chat-message { margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px; max-width: 85%; }
    .chat-message.user { background: #e5e5e5; margin-left: auto; }
    .chat-message.assistant { background: white; border: 1px solid #e5e5e5; }

    .chat-input-area { padding: 1rem; border-top: 2px solid #e5e5e5; background: white; }
    .chat-input-container { display: flex; gap: 0.5rem; }
    .chat-input-container textarea {
      flex: 1;
      padding: 1rem;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      resize: none;
      min-height: 60px;
      max-height: 120px;
    }

    .chat-input-container button {
      padding: 0.75rem 1.5rem;
      background: var(--bg-dark);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.8rem;
      transition: background 0.2s;
      align-self: flex-end;
    }

    .chat-input-container button:hover { background: #2a2020; }
    .chat-input-container button:disabled { background: #ccc; cursor: not-allowed; }

    /* Selection context display */
    .selection-context {
      background: #f0f0f0;
      border-left: 3px solid var(--bg-dark);
      padding: 0.75rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      font-size: 0.85rem;
      max-height: 150px;
      overflow-y: auto;
    }

    .selection-context-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #666;
    }

    .selection-context-header button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: #999;
      padding: 0;
    }

    .selection-context-text {
      white-space: pre-wrap;
      color: var(--text-dark);
      font-family: 'Courier New', monospace;
    }

    /* Minimal responsive adjustments */
    @media (max-width: 1200px) {
      main.sidebar-open {
        margin-right: 0;
      }

      .chat-sidebar {
        width: 100%;
        right: -100%;
      }
    }

  </style>
</head>
<body>
  <nav>
    <div class="logo">
      <img src="/SongbookLogo.svg" alt="Songbook" />
    </div>
    <ul class="nav-links">
      <li><a href="/writing" class="active">Writing</a></li>
      <li><a href="/pages">Pages</a></li>
      <li><a href="/recordings">Recordings</a></li>
      <li><a href="/chat">Chat</a></li>
      <li><a href="/profile">Profile</a></li>
    </ul>
  </nav>

  <main>
    <div class="notebook-container">
      <div class="notebook">
        <!-- Sticky note - positioned in top right -->
        <div class="sticky-note">
          <input type="text" id="noteTitle" placeholder="UNTITLED" />
          <div class="date" id="noteDate"></div>
        </div>

        <!-- Lyrics editor inside notebook -->
        <div class="lyrics-editor">
          <textarea id="lyricsContent" placeholder="Start writing your lyrics here..."></textarea>
        </div>
      </div>
    </div>

    <!-- Save indicator - outside notebook, bottom center -->
    <div class="save-indicator" id="saveIndicator">All changes saved</div>

    <!-- AI Chat Button -->
    <button class="ai-chat-btn" onclick="toggleChatSidebar()" title="Open AI Co-Writer">
      <img src="/SongbookChatIcon.svg" alt="AI Chat" />
    </button>

    <!-- Chat Sidebar -->
    <div class="chat-sidebar" id="chatSidebar">
      <div class="chat-sidebar-header">
        <h3>AI Co-Writer</h3>
        <button class="close-chat-btn" onclick="toggleChatSidebar()">&times;</button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <!-- Selection context will be inserted here -->
        <div id="selectionContext" style="display: none;" class="selection-context">
          <div class="selection-context-header">
            <span>Selected lyrics:</span>
            <button onclick="clearSelection()">&times;</button>
          </div>
          <div class="selection-context-text" id="selectionText"></div>
        </div>
      </div>
      <div class="chat-input-area">
        <div class="chat-input-container">
          <textarea id="chatInput" placeholder="Select lyrics to ask AI for help with rhymes, rewrites, ideas..." rows="2"></textarea>
          <button id="sendChatBtn" onclick="sendChatMessage()">Send</button>
        </div>
      </div>
    </div>
  </main>

  <script>
    let saveTimeout;
    let currentNoteId = null;
    const titleInput = document.getElementById('noteTitle');
    const lyricsTextarea = document.getElementById('lyricsContent');
    const saveIndicator = document.getElementById('saveIndicator');

    // Get note ID from URL or create new
    const urlParams = new URLSearchParams(window.location.search);
    const noteIdFromUrl = urlParams.get('id');

    async function loadNote() {
      try {
        if (!noteIdFromUrl) {
          // No ID in URL means brand new note - don't load anything
          currentNoteId = null;
          titleInput.value = '';
          lyricsTextarea.value = '';
          return;
        }

        const url = \`/api/note/current?id=\${noteIdFromUrl}\`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          currentNoteId = data.id;

          // Only populate if this note has been saved before (has content or a real title)
          if (data.content || (data.title && data.title !== 'Untitled')) {
            titleInput.value = data.title || '';
            lyricsTextarea.value = data.content || '';
          } else {
            // New note with this ID
            currentNoteId = noteIdFromUrl;
            titleInput.value = '';
            lyricsTextarea.value = '';
          }
        }
      } catch (error) { console.error('Error loading note:', error); }
    }

    async function saveNote() {
      saveIndicator.textContent = 'Saving...';
      saveIndicator.className = 'save-indicator saving';
      try {
        // If no current note ID, create a new unique ID
        if (!currentNoteId) {
          currentNoteId = 'note-' + Date.now();
        }

        const response = await fetch('/api/note/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentNoteId,
            title: titleInput.value || 'Untitled',
            content: lyricsTextarea.value
          })
        });
        if (response.ok) {
          const result = await response.json();
          currentNoteId = result.note.id;
          // Update URL without reloading page
          if (!noteIdFromUrl) {
            window.history.replaceState({}, '', \`/writing?id=\${currentNoteId}\`);
          }
          saveIndicator.textContent = 'All changes saved';
          saveIndicator.className = 'save-indicator saved';
        }
      } catch (error) {
        console.error('Error saving note:', error);
        saveIndicator.textContent = 'Error saving';
      }
    }

    function debouncedSave() {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveNote, 1000);
    }

    titleInput?.addEventListener('input', debouncedSave);
    lyricsTextarea?.addEventListener('input', debouncedSave);

    // Update date dynamically
    const dateEl = document.getElementById('noteDate');
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });

    loadNote();

    // Chat sidebar and selection handling
    let currentSelection = '';

    function toggleChatSidebar() {
      const sidebar = document.getElementById('chatSidebar');
      const chatBtn = document.querySelector('.ai-chat-btn');
      const mainEl = document.querySelector('main');
      sidebar.classList.toggle('open');
      chatBtn.classList.toggle('hidden');
      mainEl.classList.toggle('sidebar-open');

      // Capture any selected text when opening
      if (sidebar.classList.contains('open')) {
        captureSelection();
      }
    }

    function captureSelection() {
      const selection = lyricsTextarea.value.substring(
        lyricsTextarea.selectionStart,
        lyricsTextarea.selectionEnd
      );
      if (selection.trim()) {
        currentSelection = selection;
        document.getElementById('selectionText').textContent = selection;
        document.getElementById('selectionContext').style.display = 'block';
      }
    }

    function clearSelection() {
      currentSelection = '';
      document.getElementById('selectionContext').style.display = 'none';
    }

    // Listen for text selection changes
    lyricsTextarea?.addEventListener('mouseup', () => {
      const sidebar = document.getElementById('chatSidebar');
      if (sidebar.classList.contains('open')) {
        captureSelection();
      }
    });

    async function sendChatMessage() {
      const chatInput = document.getElementById('chatInput');
      const chatMessages = document.getElementById('chatMessages');
      const sendBtn = document.getElementById('sendChatBtn');
      const message = chatInput.value.trim();
      if (!message) return;
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-message user';
      userMsg.textContent = message;
      chatMessages.appendChild(userMsg);
      chatInput.value = '';
      sendBtn.disabled = true;
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        // If there's selected lyrics, add context to the message
        const messageWithContext = currentSelection
          ? 'Selected lyrics from my song:\\n' + currentSelection + '\\n\\nMy question: ' + message
          : message;

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-ID': 'writing-session'
          },
          body: JSON.stringify({ message: messageWithContext })
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        const assistantMsg = document.createElement('div');
        assistantMsg.className = 'chat-message assistant';
        assistantMsg.textContent = data.response || 'No response received.';
        chatMessages.appendChild(assistantMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'chat-message assistant';
        errorMsg.textContent = 'Sorry, I encountered an error. Please try again.';
        chatMessages.appendChild(errorMsg);
      } finally { sendBtn.disabled = false; }
    }

    document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  </script>
</body>
</html>`;
};
