# ChatBot AI — Next.js + Vercel

A beautiful, production-ready chatbot web app , built with **Next.js 14** and deployed on **Vercel**.

## Features

- 🤖 Rule-based chatbot engine (mirrors ahmadfaizalbh/Chatbot template logic)
- 💬 Real-time streaming-style chat UI with typing indicators
- 🎨 Premium glassmorphic dark UI with micro-animations
- ⚡ Next.js App Router + serverless API route
- 🚀 Zero-config Vercel deployment

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard (No CLI needed)

1. Push this folder to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**
5. ✅ Done! Your app is live.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts     # POST /api/chat — chatbot engine
│   ├── globals.css           # Fonts, animations, base styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Chat UI
```

## API

**POST** `/api/chat`

```json
// Request
{ "message": "Hello!" }

// Response
{ "reply": "Hi there! What's on your mind?" }

// Error
{ "error": "invalid_input", "message": "Message is required..." }
```

## Extending with Real Python Chatbot

Since Vercel runs serverless JS/TS functions, to use the original Python `chatbotAI` engine:

1. Deploy a **Python FastAPI** wrapper to **Railway** or **Render**
2. Point the `/api/chat` route to call that external Python service
3. Or use Vercel's **Python Runtime** (beta) for simple scripts
