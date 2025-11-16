# AI Songwriting Notebook

An AI-powered songwriting assistant built with Cloudflare Workers, featuring a beautiful notebook-style interface for writing lyrics with real-time AI collaboration.

## Features

- **Writing Page**: Beautiful notebook-style editor with spiral binding aesthetic and sticky note titles
- **AI Co-Writer**: Floating chat bubble with slide-out drawer for quick AI assistance
- **Full Chat Page**: Long-form conversation history with your AI songwriting assistant
- **Pages Library**: Browse all your songs with preview cards
- **Recordings**: Upload and manage voice memos and audio recordings
- **Profile**: Track your songwriting stats and manage preferences

## Tech Stack

- **Cloudflare Workers**: Serverless backend and routing
- **Hono**: Fast, lightweight web framework with JSX support
- **Workers AI**: Llama 3.3 for intelligent lyric assistance
- **Durable Objects**: Session management and chat history
- **KV**: Note storage and metadata
- **R2**: Audio file storage

## Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Installation

```bash
npm install
```

### Setup

1. Create a KV namespace:
```bash
wrangler kv:namespace create NOTES_KV
```

2. Create an R2 bucket:
```bash
wrangler r2 bucket create songbook-recordings
```

3. Update `wrangler.toml` with your namespace IDs

### Development

```bash
npm run dev
```

Visit `http://localhost:8787`

### Deployment

```bash
npm run deploy
```

## Project Structure

```
src/
├── index.tsx                    # Main Hono app
├── components/
│   └── Layout.tsx              # Shared layout with navigation
├── pages/
│   ├── Writing.tsx             # Main notebook editor
│   ├── Chat.tsx                # Full chat page
│   ├── Pages.tsx               # Songs library
│   ├── Recordings.tsx          # Audio management
│   └── Profile.tsx             # User profile
└── durable-objects/
    ├── ChatSession.ts          # Chat history storage
    └── NoteCoordinator.ts      # Note workflow coordination
```

## AI Features

The AI co-writer can help with:
- Finding rhymes and synonyms
- Rewriting lines for better flow
- Brainstorming creative ideas
- Improving song structure
- Providing constructive feedback

## License

MIT
