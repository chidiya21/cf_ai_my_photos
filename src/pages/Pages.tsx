import { Layout } from '../components/Layout';
import { html } from 'hono/html';

export const PagesPage = () => {
  return (
    <Layout activePage="pages" title="My Pages - Songbook">
      {html`
        <style>
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

        <button class="new-page-btn" onclick="window.location.href='/writing'">
          + New Song
        </button>

        <div class="pages-grid" id="pagesGrid">
          <div class="empty-state">
            <h2>No songs yet</h2>
            <p>Start writing your first song!</p>
          </div>
        </div>

        <script>
          async function loadPages() {
            try {
              const response = await fetch('/api/notes');
              if (response.ok) {
                const notes = await response.json();
                const grid = document.getElementById('pagesGrid');

                if (notes.length === 0) return;

                grid.innerHTML = '';

                notes.forEach(note => {
                  const card = document.createElement('div');
                  card.className = 'page-card';
                  card.onclick = () => window.location.href = \`/writing?id=\${note.id}\`;

                  const date = new Date(note.lastModified).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  const preview = note.content.slice(0, 150) + (note.content.length > 150 ? '...' : '');

                  card.innerHTML = \`
                    <h3>\${note.title}</h3>
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
      `}
    </Layout>
  );
};
