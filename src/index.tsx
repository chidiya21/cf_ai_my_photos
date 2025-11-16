import { Hono } from 'hono';
import { WritingPage } from './pages/Writing';
import { ChatPage } from './pages/Chat';
import { PagesPage } from './pages/Pages';
import { RecordingsPage } from './pages/Recordings';
import { ProfilePage } from './pages/Profile';
import { ChatSession } from './durable-objects/ChatSession';
import { NoteCoordinator } from './durable-objects/NoteCoordinator';

// Type definitions for Cloudflare bindings
type Bindings = {
  AI: any;
  NOTES_KV: KVNamespace;
  RECORDINGS: R2Bucket;
  CHAT_SESSION: DurableObjectNamespace;
  NOTE_COORDINATOR: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

// Export Durable Objects
export { ChatSession, NoteCoordinator };

// ===== PAGE ROUTES =====

app.get('/', (c) => c.redirect('/writing'));

app.get('/writing', (c) => {
  return c.html(WritingPage());
});

app.get('/chat', (c) => {
  return c.html(ChatPage());
});

app.get('/pages', (c) => {
  return c.html(PagesPage());
});

app.get('/recordings', (c) => {
  return c.html(RecordingsPage());
});

app.get('/profile', (c) => {
  return c.html(ProfilePage());
});

// ===== API ROUTES =====

// Chat API - uses Workers AI (Llama 3.3)
app.post('/api/chat', async (c) => {
  try {
    const { message } = await c.req.json();

    // Get or create chat session
    const sessionId = c.req.header('X-Session-ID') || 'default-session';
    const id = c.env.CHAT_SESSION.idFromName(sessionId);
    const stub = c.env.CHAT_SESSION.get(id);

    // Store user message
    await stub.fetch('http://do/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', content: message })
    });

    // Get conversation history for context
    const historyResponse = await stub.fetch('http://do/messages');
    const history = await historyResponse.json();

    // Build context for AI
    const systemPrompt = `You are an expert songwriting assistant. Help users with:
- Writing and refining lyrics
- Finding rhymes and synonyms
- Brainstorming creative ideas and themes
- Improving song structure and flow
- Providing constructive feedback

Be creative, supportive, and insightful. Keep responses focused on songwriting.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call Workers AI with Llama 3.3
    const aiResponse = await c.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages,
      stream: false
    });

    const assistantMessage = aiResponse.response || 'I apologize, but I encountered an error. Please try again.';

    // Store assistant response
    await stub.fetch('http://do/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'assistant', content: assistantMessage })
    });

    return c.json({ response: assistantMessage });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Failed to process message' }, 500);
  }
});

// Get chat history
app.get('/api/chat/history', async (c) => {
  try {
    const sessionId = c.req.header('X-Session-ID') || 'default-session';
    const id = c.env.CHAT_SESSION.idFromName(sessionId);
    const stub = c.env.CHAT_SESSION.get(id);

    const response = await stub.fetch('http://do/messages');
    const messages = await response.json();

    return c.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return c.json([]);
  }
});

// Note API - uses KV for storage
app.get('/api/note/current', async (c) => {
  try {
    const noteId = c.req.query('id') || 'current-note';
    const note = await c.env.NOTES_KV.get(noteId, 'json');

    if (!note) {
      return c.json({
        id: noteId,
        title: 'Untitled',
        content: '',
        lastModified: Date.now()
      });
    }

    return c.json(note);
  } catch (error) {
    console.error('Error loading note:', error);
    return c.json({ error: 'Failed to load note' }, 500);
  }
});

app.post('/api/note/save', async (c) => {
  try {
    const { id, title, content } = await c.req.json();
    const noteId = id || 'current-note';

    const noteData = {
      id: noteId,
      title: title || 'Untitled',
      content: content || '',
      lastModified: Date.now()
    };

    await c.env.NOTES_KV.put(noteId, JSON.stringify(noteData));

    // Also update the notes list
    const notesList = await c.env.NOTES_KV.get('notes-list', 'json') || [];
    const existingIndex = notesList.findIndex((n: any) => n.id === noteId);

    if (existingIndex >= 0) {
      notesList[existingIndex] = noteData;
    } else {
      notesList.push(noteData);
    }

    await c.env.NOTES_KV.put('notes-list', JSON.stringify(notesList));

    return c.json({ success: true, note: noteData });
  } catch (error) {
    console.error('Error saving note:', error);
    return c.json({ error: 'Failed to save note' }, 500);
  }
});

// Get all notes
app.get('/api/notes', async (c) => {
  try {
    const notesList = await c.env.NOTES_KV.get('notes-list', 'json') || [];
    return c.json(notesList);
  } catch (error) {
    console.error('Error loading notes:', error);
    return c.json([]);
  }
});

// Recordings API - uses R2 for storage
app.post('/api/recordings/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const recordingId = crypto.randomUUID();
    const fileName = `${recordingId}-${file.name}`;

    // Upload to R2
    await c.env.RECORDINGS.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type
      }
    });

    // Store metadata in KV
    const recordingData = {
      id: recordingId,
      name: file.name,
      fileName,
      uploadedAt: Date.now(),
      size: file.size,
      type: file.type
    };

    const recordingsList = await c.env.NOTES_KV.get('recordings-list', 'json') || [];
    recordingsList.push(recordingData);
    await c.env.NOTES_KV.put('recordings-list', JSON.stringify(recordingsList));

    return c.json({ success: true, recording: recordingData });
  } catch (error) {
    console.error('Error uploading recording:', error);
    return c.json({ error: 'Failed to upload recording' }, 500);
  }
});

app.get('/api/recordings', async (c) => {
  try {
    const recordingsList = await c.env.NOTES_KV.get('recordings-list', 'json') || [];
    return c.json(recordingsList);
  } catch (error) {
    console.error('Error loading recordings:', error);
    return c.json([]);
  }
});

app.get('/api/recordings/:id/play', async (c) => {
  try {
    const recordingId = c.req.param('id');
    const recordingsList = await c.env.NOTES_KV.get('recordings-list', 'json') || [];
    const recording = recordingsList.find((r: any) => r.id === recordingId);

    if (!recording) {
      return c.json({ error: 'Recording not found' }, 404);
    }

    const object = await c.env.RECORDINGS.get(recording.fileName);

    if (!object) {
      return c.json({ error: 'File not found' }, 404);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': recording.type,
        'Accept-Ranges': 'bytes'
      }
    });
  } catch (error) {
    console.error('Error playing recording:', error);
    return c.json({ error: 'Failed to play recording' }, 500);
  }
});

app.get('/api/recordings/:id/download', async (c) => {
  try {
    const recordingId = c.req.param('id');
    const recordingsList = await c.env.NOTES_KV.get('recordings-list', 'json') || [];
    const recording = recordingsList.find((r: any) => r.id === recordingId);

    if (!recording) {
      return c.json({ error: 'Recording not found' }, 404);
    }

    const object = await c.env.RECORDINGS.get(recording.fileName);

    if (!object) {
      return c.json({ error: 'File not found' }, 404);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': recording.type,
        'Content-Disposition': `attachment; filename="${recording.name}"`
      }
    });
  } catch (error) {
    console.error('Error downloading recording:', error);
    return c.json({ error: 'Failed to download recording' }, 500);
  }
});

app.delete('/api/recordings/:id', async (c) => {
  try {
    const recordingId = c.req.param('id');
    const recordingsList = await c.env.NOTES_KV.get('recordings-list', 'json') || [];
    const recording = recordingsList.find((r: any) => r.id === recordingId);

    if (recording) {
      await c.env.RECORDINGS.delete(recording.fileName);
    }

    const updatedList = recordingsList.filter((r: any) => r.id !== recordingId);
    await c.env.NOTES_KV.put('recordings-list', JSON.stringify(updatedList));

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting recording:', error);
    return c.json({ error: 'Failed to delete recording' }, 500);
  }
});

// Profile API
app.get('/api/profile', async (c) => {
  try {
    const profile = await c.env.NOTES_KV.get('user-profile', 'json') || {};
    return c.json(profile);
  } catch (error) {
    console.error('Error loading profile:', error);
    return c.json({});
  }
});

app.post('/api/profile', async (c) => {
  try {
    const profileData = await c.req.json();
    await c.env.NOTES_KV.put('user-profile', JSON.stringify(profileData));
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    return c.json({ error: 'Failed to save profile' }, 500);
  }
});

// Stats API
app.get('/api/stats', async (c) => {
  try {
    const notesList = await c.env.NOTES_KV.get('notes-list', 'json') || [];
    const recordingsList = await c.env.NOTES_KV.get('recordings-list', 'json') || [];

    const sessionId = 'default-session';
    const id = c.env.CHAT_SESSION.idFromName(sessionId);
    const stub = c.env.CHAT_SESSION.get(id);
    const historyResponse = await stub.fetch('http://do/messages');
    const chatHistory = await historyResponse.json();

    return c.json({
      songs: notesList.length,
      recordings: recordingsList.length,
      chats: chatHistory.length
    });
  } catch (error) {
    console.error('Error loading stats:', error);
    return c.json({ songs: 0, recordings: 0, chats: 0 });
  }
});

export default app;
