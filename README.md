# My Photography Portfolio

Photography portfolio website with AI-powered scheduling built on Cloudflare Workers. Has intelligent booking assistance and seamless calendar integration.

## Features

- **AI-Powered Scheduling Assistant**: Natural language booking using Workers AI (Llama 3.3 70B)
- **Smart Calendar Integration**: Automated scheduling with Google Calendar API
- **Durable Objects Workflows**: Manage booking sessions and real-time chat coordination
- **Photo Gallery**: R2-powered photo storage with category organization
- **Responsive Design**: Mobile-first design inspired by modern photography portfolios
- **Real-time Chat**: AI chatbot for visitor inquiries and booking assistance

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **AI**: Workers AI (Llama 3.3 70B Instruct)
- **State Management**: Durable Objects Workflows
- **Storage**:
  - R2 for photos
  - KV for chat memory
  - Google Calendar for bookings
- **Language**: TypeScript

## Project Structure

```
cf_ai_my_photos/
├── src/
│   ├── index.ts                    # Main Hono application
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── durable-objects/
│   │   └── booking-workflow.ts     # Booking session management
│   ├── services/
│   │   ├── calendar.ts             # Google Calendar integration
│   │   ├── ai.ts                   # Workers AI service
│   │   ├── photos.ts               # R2 photo management
│   │   └── memory.ts               # KV chat memory
│   ├── components/
│   │   └── Layout.tsx              # Page layout component
│   ├── pages/
│   │   ├── home.tsx                # Home page
│   │   ├── about.tsx               # About page
│   │   ├── portfolio.tsx           # Portfolio gallery
│   │   ├── services.tsx            # Services page
│   │   ├── schedule.tsx            # Scheduling page
│   │   └── contact.tsx             # Contact page
│   └── utils/
│       └── styles.ts               # Design tokens and styles
├── public/                         # Static assets
├── wrangler.toml                   # Cloudflare Workers config
├── package.json                    # Dependencies
└── tsconfig.json                   # TypeScript config
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Cloudflare Workers account
- Google Calendar API credentials
- Wrangler CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cf_ai_my_photos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Update `wrangler.toml` with your settings:
   - Set your Google Calendar ID
   - Configure KV namespace IDs
   - Set R2 bucket names

4. **Set up secrets**
   ```bash
   # Google Calendar credentials
   wrangler secret put GOOGLE_CLIENT_EMAIL
   wrangler secret put GOOGLE_PRIVATE_KEY
   ```

5. **Create R2 bucket**
   ```bash
   wrangler r2 bucket create photography-portfolio
   ```

6. **Create KV namespace**
   ```bash
   wrangler kv:namespace create CHAT_MEMORY
   ```

### Development

```bash
npm run dev
```

This starts the development server at `http://localhost:8787`

### Deployment

```bash
npm run deploy
```

## API Endpoints

### Scheduling

- `GET /api/availability?date=YYYY-MM-DD&serviceType=portrait` - Check availability
- `POST /api/schedule` - Create booking

### Chat

- `POST /api/chat/session` - Create new chat session
- `POST /api/chat/message` - Send message to AI assistant

### Photos

- `GET /api/photos` - Get all photos
- `GET /api/photos/:category` - Get photos by category
- `POST /api/photos/upload` - Upload photo (admin)

### Services

- `GET /api/services` - Get photography services info

## AI Features

### Scheduling Assistant

The AI assistant helps visitors:
- Choose photography services
- Check availability
- Provide booking information
- Confirm appointments
- Handle scheduling conflicts

### Conversation Flow

1. **Initiated**: Ask about service type
2. **Collecting Info**: Gather name, email, phone
3. **Checking Availability**: Find available time slots
4. **Confirming**: Review and confirm booking
5. **Completed**: Booking confirmed

## Configuration

### Google Calendar Setup

1. Create a Google Cloud project
2. Enable Google Calendar API
3. Create service account credentials
4. Share your calendar with the service account email
5. Add credentials as Wrangler secrets

### R2 Photo Upload

Photos are organized by category:
- `portrait/`
- `event/`
- `wedding/`
- `commercial/`
- `featured/`

### Workers AI

Using Llama 3.3 70B Instruct model:
- Natural language understanding
- Intent detection
- Data extraction
- Conversational responses

## Development Notes

- TypeScript strict mode enabled
- ES2022 target for modern features
- Module bundling via Wrangler
- JSX for component rendering

## Contact

Shriya Sateesh, sshriya@cs.washington.edu

![gif of cat spinning on skateboard](https://media.tenor.com/y8zjaIK8rpoAAAAM/cat-on-skateboard-cat.gif)

Built using Cloudflare Workers, Hono, and Workers AI
