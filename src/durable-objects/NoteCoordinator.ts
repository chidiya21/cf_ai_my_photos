// NoteCoordinator Durable Object - manages workflow and session coordination
export class NoteCoordinator {
  private state: DurableObjectState;
  private noteData: {
    id: string;
    title: string;
    content: string;
    lastModified: number;
    chatSessionId?: string;
  } | null = null;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Load note data if not in memory
    if (!this.noteData) {
      const stored = await this.state.storage.get<typeof this.noteData>('noteData');
      if (stored) {
        this.noteData = stored;
      }
    }

    if (path === '/note' && request.method === 'GET') {
      return new Response(JSON.stringify(this.noteData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/note' && request.method === 'PUT') {
      const data = await request.json<Partial<typeof this.noteData>>();

      this.noteData = {
        id: this.noteData?.id || data.id || crypto.randomUUID(),
        title: data.title || this.noteData?.title || 'Untitled',
        content: data.content || this.noteData?.content || '',
        lastModified: Date.now(),
        chatSessionId: data.chatSessionId || this.noteData?.chatSessionId
      };

      await this.state.storage.put('noteData', this.noteData);

      return new Response(JSON.stringify(this.noteData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/session' && request.method === 'POST') {
      const { sessionId } = await request.json<{ sessionId: string }>();

      if (this.noteData) {
        this.noteData.chatSessionId = sessionId;
        await this.state.storage.put('noteData', this.noteData);
      }

      return new Response(JSON.stringify({ success: true, sessionId }));
    }

    return new Response('Not Found', { status: 404 });
  }
}
