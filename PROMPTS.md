# Project Prompts

## 2025-11-15

### Initial Project Setup
```
Hi! I'm building a photography portfolio website that includes a scheduling system connected to my Google Calendar. The project will use Cloudflare Workers, Workers AI (Llama 3.3), and a workflow using Workers/Durable Objects. I will share Figma designs as reference for the UI. Important: For every prompt I send and every response you generate that contributes to this project, including this one, please record the prompt neatly in a file called PROMPTS.md automatically.

Additional Info: I think Hono will work well with Cloudlfare Workers, so let's do that! We can update the gitignore accordingly. I have the Google Calendar API credentials set up, so that's all good. It will be read-write to book appointments. The Llama 3.3 will be used for an automated scheduling assistant as well as a chatbot for visitor inquiries. The Durable Objects Workflow will be used for managing booking state/sessions, real-time chat coordination, and cheduling conflict resolution. The Figma design provided is for style reference but does not have all pages (it is only the home page), is not configured for this project specifically, so feel free to go ahead and fill in what is needed. I will use Google Calendar as databse for scheduling and storing client info (in event descriptions), R2 for photos, KV for AI memory (chat). For the PROMPTS.md let's just do user prompts and timestamps, nothing else. Thanks!
```
