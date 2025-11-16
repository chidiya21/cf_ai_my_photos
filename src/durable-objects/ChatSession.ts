// ChatSession Durable Object - manages chat history per note
export class ChatSession {
  private state: DurableObjectState;
  private messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }> = [];

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Load existing messages on first request
    if (this.messages.length === 0) {
      const stored = await this.state.storage.get<typeof this.messages>('messages');
      if (stored) {
        this.messages = stored;
      }
    }

    if (path === '/messages' && request.method === 'GET') {
      return new Response(JSON.stringify(this.messages), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/messages' && request.method === 'POST') {
      const { role, content } = await request.json<{ role: 'user' | 'assistant'; content: string }>();
      const message = { role, content, timestamp: Date.now() };

      this.messages.push(message);
      await this.state.storage.put('messages', this.messages);

      return new Response(JSON.stringify(message), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/clear' && request.method === 'POST') {
      this.messages = [];
      await this.state.storage.delete('messages');
      return new Response(JSON.stringify({ success: true }));
    }

    return new Response('Not Found', { status: 404 });
  }
}
