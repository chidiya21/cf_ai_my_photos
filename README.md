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

**Option 1: Local Development**
- Node.js 18+
- Cloudflare account
- Wrangler CLI

**Option 2: Docker (Recommended)**
- Docker 20.10+
- Docker Compose 2.0+
- Cloudflare account

### Installation

#### Using Docker (Recommended)

1. **Build and start the development container:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f songbook-dev
   ```

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

The app will be available at `http://localhost:8787`

#### Using Local Node

```bash
npm install
```

### Setup

1. Create a KV namespace:
```bash
# If using Docker:
docker-compose exec songbook-dev wrangler kv:namespace create NOTES_KV

# If using local Node:
wrangler kv:namespace create NOTES_KV
```

2. Create an R2 bucket:
```bash
# If using Docker:
docker-compose exec songbook-dev wrangler r2 bucket create songbook-recordings

# If using local Node:
wrangler r2 bucket create songbook-recordings
```

3. Update `wrangler.toml` with your namespace IDs

### Development

#### Using Docker

```bash
# Start development server
docker-compose up

# Or run in detached mode
docker-compose up -d

# Rebuild container after dependency changes
docker-compose up --build
```

Visit `http://localhost:8787`

#### Using Local Node

```bash
npm run dev
```

Visit `http://localhost:8787`

### Production Testing (Docker)

Test the production build locally before deploying:

```bash
docker-compose --profile production up songbook-prod
```

Visit `http://localhost:8788`

### Deployment

Deploy to Cloudflare Workers:

```bash
# If using Docker:
docker-compose exec songbook-dev npm run deploy

# If using local Node:
npm run deploy
```

### Docker Commands Reference

```bash
# Build the image
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f songbook-dev

# Execute commands in container
docker-compose exec songbook-dev <command>

# Restart services
docker-compose restart

# Remove containers and volumes
docker-compose down -v
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
