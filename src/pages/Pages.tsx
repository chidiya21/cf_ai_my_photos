import { html } from 'hono/html';

export const PagesPage = () => {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Pages - Songbook</title>
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

    .pages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      padding: 1rem;
    }

    .page-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px var(--shadow-subtle);
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .page-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px var(--shadow-subtle);
      border-color: var(--bg-dark);
    }

    .page-card h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--text-dark);
    }

    .page-card .date {
      font-size: 0.85rem;
      color: #999;
      margin-bottom: 1rem;
    }

    .page-card .preview {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.6;
      max-height: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .new-page-btn {
      background: var(--bg-dark);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      margin-bottom: 2rem;
      transition: background 0.2s;
    }

    .new-page-btn:hover {
      background: #2a2020;
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #999;
    }

    .empty-state h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
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
      <li><a href="/pages" class="active">Pages</a></li>
      <li><a href="/recordings">Recordings</a></li>
      <li><a href="/chat">Chat</a></li>
      <li><a href="/profile">Profile</a></li>
    </ul>
  </nav>

  <main>
    <button class="new-page-btn" onclick="createNewSong()">
      + New Song
    </button>

    <div class="pages-grid" id="pagesGrid">
      <div class="empty-state">
        <h2>No songs yet</h2>
        <p>Start writing your first song!</p>
      </div>
    </div>
  </main>

  <script>
    function createNewSong() {
      // Generate a unique ID for the new song
      const newNoteId = 'note-' + Date.now();
      // Navigate to writing page with new note ID
      window.location.href = \`/writing?id=\${newNoteId}\`;
    }

    async function loadPages() {
      try {
        const response = await fetch('/api/notes');
        if (response.ok) {
          const notes = await response.json();
          const grid = document.getElementById('pagesGrid');

          if (notes.length === 0) return;

          grid.innerHTML = '';

          // Sort notes by last modified (newest first)
          notes.sort((a, b) => b.lastModified - a.lastModified);

          notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'page-card';
            card.onclick = () => window.location.href = \`/writing?id=\${note.id}\`;

            const date = new Date(note.lastModified).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            const preview = note.content ? note.content.slice(0, 150) + (note.content.length > 150 ? '...' : '') : 'Empty song';

            card.innerHTML = \`
              <h3>\${note.title || 'Untitled'}</h3>
              <div class="date">\${date}</div>
              <div class="preview">\${preview}</div>
            \`;

            grid.appendChild(card);
          });
        }
      } catch (error) {
        console.error('Error loading pages:', error);
      }
    }

    loadPages();
  </script>
</body>
</html>`;
};
