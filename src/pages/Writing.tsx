import { Layout } from '../components/Layout';
import { html } from 'hono/html';

export const WritingPage = () => {
  return (
    <Layout activePage="writing">
      {html`
        <style>
          .notebook-container {
            max-width: 900px;
            margin: 0 auto;
            perspective: 1000px;
          }

          .notebook {
            background: var(--paper-cream);
            border-radius: 8px;
            padding: 3rem 2rem 3rem 4rem;
            box-shadow:
              -4px 0 8px rgba(0, 0, 0, 0.1),
              0 8px 20px rgba(0, 0, 0, 0.2);
            position: relative;
            min-height: 600px;
            transform: rotateY(-2deg);
          }

          /* Spiral binding effect */
          .spiral {
            position: absolute;
            left: 2rem;
            top: 2rem;
            bottom: 2rem;
            width: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .spiral-ring {
            width: 12px;
            height: 24px;
            border: 2px solid var(--spiral-metal);
            border-radius: 50%;
            background: transparent;
          }

          /* Sticky note for title */
          .sticky-note {
            position: absolute;
            right: 10%;
            top: -1rem;
            width: 280px;
            height: 120px;
            background: var(--paper-yellow);
            padding: 1.5rem;
            box-shadow: 0 4px 8px var(--shadow-subtle);
            transform: rotate(2deg);
          }

          .sticky-note::before {
            content: '';
            position: absolute;
            top: -8px;
            right: 30px;
            width: 40px;
            height: 50px;
            background: linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.1) 40%);
            clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
          }

          .sticky-note input {
            background: transparent;
            border: none;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            text-align: center;
            width: 100%;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .sticky-note .date {
            text-align: center;
            font-size: 0.85rem;
            color: #666;
          }

          /* Lyrics editor */
          .lyrics-editor {
            margin-top: 4rem;
            min-height: 500px;
          }

          .lyrics-editor textarea {
            width: 100%;
            min-height: 500px;
            background: transparent;
            border: none;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            line-height: 1.8;
            color: var(--text-dark);
            resize: none;
            outline: none;
          }

          .lyrics-editor textarea::placeholder {
            color: #999;
          }

          /* Auto-save indicator */
          .save-indicator {
            position: absolute;
            top: 1rem;
            left: 4rem;
            font-size: 0.8rem;
            color: #999;
          }

          .save-indicator.saving {
            color: #666;
          }

          .save-indicator.saved {
            color: #4a9d5f;
          }
        </style>

        <div class="notebook-container">
          <div class="notebook">
            <!-- Spiral binding -->
            <div class="spiral">
              <div class="spiral-ring"></div>
              <div class="spiral-ring"></div>
              <div class="spiral-ring"></div>
              <div class="spiral-ring"></div>
              <div class="spiral-ring"></div>
              <div class="spiral-ring"></div>
              <div class="spiral-ring"></div>
              <div class="spiral-ring"></div>
            </div>

            <!-- Sticky note title -->
            <div class="sticky-note">
              <input
                type="text"
                id="noteTitle"
                placeholder="WORKING TITLE"
                value="WORKING TITLE"
              />
              <div class="date" id="noteDate">NOV 15</div>
            </div>

            <!-- Save indicator -->
            <div class="save-indicator" id="saveIndicator">
              All changes saved
            </div>

            <!-- Lyrics editor -->
            <div class="lyrics-editor">
              <textarea
                id="lyricsContent"
                placeholder="Start writing your lyrics here...

You can ask the AI for help with:
- Finding rhymes
- Rewriting lines
- Brainstorming ideas
- Improving flow"
              ></textarea>
            </div>
          </div>
        </div>

        <script>
          let saveTimeout;
          const titleInput = document.getElementById('noteTitle');
          const lyricsTextarea = document.getElementById('lyricsContent');
          const saveIndicator = document.getElementById('saveIndicator');

          // Load existing note
          async function loadNote() {
            try {
              const response = await fetch('/api/note/current');
              if (response.ok) {
                const data = await response.json();
                if (data.title) titleInput.value = data.title;
                if (data.content) lyricsTextarea.value = data.content;
              }
            } catch (error) {
              console.error('Error loading note:', error);
            }
          }

          // Auto-save function
          async function saveNote() {
            saveIndicator.textContent = 'Saving...';
            saveIndicator.className = 'save-indicator saving';

            try {
              const response = await fetch('/api/note/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: titleInput.value,
                  content: lyricsTextarea.value
                })
              });

              if (response.ok) {
                saveIndicator.textContent = 'All changes saved';
                saveIndicator.className = 'save-indicator saved';
              }
            } catch (error) {
              console.error('Error saving note:', error);
              saveIndicator.textContent = 'Error saving';
            }
          }

          // Debounced save
          function debouncedSave() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveNote, 1000);
          }

          titleInput?.addEventListener('input', debouncedSave);
          lyricsTextarea?.addEventListener('input', debouncedSave);

          // Update date
          const dateEl = document.getElementById('noteDate');
          const now = new Date();
          dateEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

          // Load note on page load
          loadNote();
        </script>
      `}
    </Layout>
  );
};
