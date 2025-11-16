import { Layout } from '../components/Layout';
import { html } from 'hono/html';

export const RecordingsPage = () => {
  return (
    <Layout activePage="recordings" title="Recordings - Songbook">
      {html`
        <style>
          .recordings-container {
            max-width: 900px;
            margin: 0 auto;
          }

          .upload-section {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: center;
            box-shadow: 0 2px 8px var(--shadow-subtle);
          }

          .upload-section h2 {
            margin-bottom: 1rem;
          }

          .upload-btn {
            padding: 1rem 2rem;
            background: var(--bg-dark);
            color: white;
            border: none;
            border-radius: 8px;
            font-family: inherit;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
          }

          .upload-btn:hover {
            background: #2a2020;
          }

          .recordings-list {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 2px 8px var(--shadow-subtle);
          }

          .recording-item {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .recording-item:last-child {
            border-bottom: none;
          }

          .recording-icon {
            width: 48px;
            height: 48px;
            background: var(--paper-yellow);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
          }

          .recording-info {
            flex: 1;
          }

          .recording-info h3 {
            margin-bottom: 0.25rem;
          }

          .recording-info .date {
            font-size: 0.85rem;
            color: #999;
          }

          .recording-actions {
            display: flex;
            gap: 0.5rem;
          }

          .recording-actions button {
            padding: 0.5rem 1rem;
            border: 1px solid #e5e5e5;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s;
          }

          .recording-actions button:hover {
            background: #f5f5f5;
            border-color: var(--bg-dark);
          }

          .empty-state {
            text-align: center;
            padding: 4rem;
            color: #999;
          }
        </style>

        <div class="recordings-container">
          <div class="upload-section">
            <h2>Upload Voice Memo or Recording</h2>
            <p style="margin-bottom: 1rem; color: #666;">
              Share your ideas, demos, or reference tracks
            </p>
            <input type="file" id="fileInput" accept="audio/*" style="display: none;" onchange="handleFileUpload(event)" />
            <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
              🎤 Choose File
            </button>
          </div>

          <div class="recordings-list" id="recordingsList">
            <div class="empty-state">
              <h2>No recordings yet</h2>
              <p>Upload your first voice memo or recording</p>
            </div>
          </div>
        </div>

        <script>
          async function loadRecordings() {
            try {
              const response = await fetch('/api/recordings');
              if (response.ok) {
                const recordings = await response.json();
                const list = document.getElementById('recordingsList');

                if (recordings.length === 0) return;

                list.innerHTML = '';

                recordings.forEach(recording => {
                  const item = document.createElement('div');
                  item.className = 'recording-item';

                  const date = new Date(recording.uploadedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  item.innerHTML = \`
                    <div class="recording-icon">🎵</div>
                    <div class="recording-info">
                      <h3>\${recording.name}</h3>
                      <div class="date">\${date}</div>
                    </div>
                    <div class="recording-actions">
                      <button onclick="playRecording('\${recording.id}')">Play</button>
                      <button onclick="downloadRecording('\${recording.id}')">Download</button>
                      <button onclick="deleteRecording('\${recording.id}')">Delete</button>
                    </div>
                  \`;

                  list.appendChild(item);
                });
              }
            } catch (error) {
              console.error('Error loading recordings:', error);
            }
          }

          async function handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
              const response = await fetch('/api/recordings/upload', {
                method: 'POST',
                body: formData
              });

              if (response.ok) {
                loadRecordings();
              }
            } catch (error) {
              console.error('Error uploading file:', error);
              alert('Error uploading file. Please try again.');
            }
          }

          function playRecording(id) {
            // Implement play functionality
            window.open(\`/api/recordings/\${id}/play\`, '_blank');
          }

          function downloadRecording(id) {
            window.open(\`/api/recordings/\${id}/download\`, '_blank');
          }

          async function deleteRecording(id) {
            if (!confirm('Are you sure you want to delete this recording?')) return;

            try {
              await fetch(\`/api/recordings/\${id}\`, { method: 'DELETE' });
              loadRecordings();
            } catch (error) {
              console.error('Error deleting recording:', error);
            }
          }

          loadRecordings();
        </script>
      `}
    </Layout>
  );
};
