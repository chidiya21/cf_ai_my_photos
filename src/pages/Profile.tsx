import { Layout } from '../components/Layout';
import { html } from 'hono/html';

export const ProfilePage = () => {
  return (
    <Layout activePage="profile" title="Profile - Songbook">
      {html`
        <style>
          .profile-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 2px 8px var(--shadow-subtle);
          }

          .profile-header {
            text-align: center;
            padding-bottom: 2rem;
            border-bottom: 2px solid #e5e5e5;
            margin-bottom: 2rem;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
            background: var(--bg-dark);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            margin: 0 auto 1rem;
          }

          .profile-section {
            margin-bottom: 2rem;
          }

          .profile-section h2 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: var(--text-dark);
          }

          .profile-field {
            margin-bottom: 1rem;
          }

          .profile-field label {
            display: block;
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.5rem;
          }

          .profile-field input,
          .profile-field textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
            font-family: inherit;
            font-size: 0.95rem;
          }

          .profile-field textarea {
            resize: vertical;
            min-height: 100px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .stat-card {
            text-align: center;
            padding: 1.5rem;
            background: #f9f9f9;
            border-radius: 8px;
          }

          .stat-card .number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--bg-dark);
            margin-bottom: 0.5rem;
          }

          .stat-card .label {
            font-size: 0.85rem;
            color: #666;
          }

          .save-btn {
            width: 100%;
            padding: 1rem;
            background: var(--bg-dark);
            color: white;
            border: none;
            border-radius: 8px;
            font-family: inherit;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
          }

          .save-btn:hover {
            background: #2a2020;
          }
        </style>

        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-avatar">✍️</div>
            <h1>Your Songwriter Profile</h1>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="number" id="songCount">0</div>
              <div class="label">Songs</div>
            </div>
            <div class="stat-card">
              <div class="number" id="recordingCount">0</div>
              <div class="label">Recordings</div>
            </div>
            <div class="stat-card">
              <div class="number" id="chatCount">0</div>
              <div class="label">AI Chats</div>
            </div>
          </div>

          <div class="profile-section">
            <h2>Personal Info</h2>
            <div class="profile-field">
              <label>Display Name</label>
              <input type="text" id="displayName" placeholder="Your name" />
            </div>
            <div class="profile-field">
              <label>Bio</label>
              <textarea id="bio" placeholder="Tell us about your songwriting journey..."></textarea>
            </div>
          </div>

          <div class="profile-section">
            <h2>Preferences</h2>
            <div class="profile-field">
              <label>Favorite Genres</label>
              <input type="text" id="genres" placeholder="Pop, Rock, Country..." />
            </div>
            <div class="profile-field">
              <label>Writing Goals</label>
              <textarea id="goals" placeholder="What do you want to achieve with your songwriting?"></textarea>
            </div>
          </div>

          <button class="save-btn" onclick="saveProfile()">Save Profile</button>
        </div>

        <script>
          async function loadProfile() {
            try {
              const response = await fetch('/api/profile');
              if (response.ok) {
                const data = await response.json();

                if (data.displayName) document.getElementById('displayName').value = data.displayName;
                if (data.bio) document.getElementById('bio').value = data.bio;
                if (data.genres) document.getElementById('genres').value = data.genres;
                if (data.goals) document.getElementById('goals').value = data.goals;
              }
            } catch (error) {
              console.error('Error loading profile:', error);
            }
          }

          async function loadStats() {
            try {
              const response = await fetch('/api/stats');
              if (response.ok) {
                const stats = await response.json();
                document.getElementById('songCount').textContent = stats.songs || 0;
                document.getElementById('recordingCount').textContent = stats.recordings || 0;
                document.getElementById('chatCount').textContent = stats.chats || 0;
              }
            } catch (error) {
              console.error('Error loading stats:', error);
            }
          }

          async function saveProfile() {
            const profileData = {
              displayName: document.getElementById('displayName').value,
              bio: document.getElementById('bio').value,
              genres: document.getElementById('genres').value,
              goals: document.getElementById('goals').value
            };

            try {
              const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
              });

              if (response.ok) {
                alert('Profile saved successfully!');
              }
            } catch (error) {
              console.error('Error saving profile:', error);
              alert('Error saving profile. Please try again.');
            }
          }

          loadProfile();
          loadStats();
        </script>
      `}
    </Layout>
  );
};
