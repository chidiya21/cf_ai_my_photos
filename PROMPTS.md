# Project Prompts Log

This file contains a record of all major prompts and requests made during the development of this AI-powered songwriting notebook.

---

## 2025-11-15 (Initial Setup)

**PROMPT:** Hi! I'm building an AI-powered songwriting notebook using Cloudflare.

The app will include:
- A main Writing page with a notebook-style lyric editor.
- A floating chat bubble that opens an AI co-writer chat drawer.
- A full Chat page with long-form conversation history.
- A Pages/Recordings/Profile nav (UI from my Figma reference).

The project will use:
- Cloudflare Workers (backend + routes)
- Workers AI (Llama 3.3) for lyric help, brainstorming, rewriting, and idea generation
- Durable Objects for session memory, chat history per note, and workflow coordination
- KV for storing notes, titles, timestamps, and basic metadata
- R2 for audio/voice memo uploads

UI Notes:
- The Figma design I provided shows the Writing page aesthetic, but does not include every page.
- You can create or extend layouts as needed to complete the app.

Important:
For every prompt I send related to this project (including this one), please output a short snippet I can paste into PROMPTS.md containing:
1. Timestamp (YYYY-MM-DD HH:MM)
2. "PROMPT:" + my message

We will use Hono for routing and JSX-rendered pages.
Thank you!

---
