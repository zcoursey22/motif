**Motif** is a musical practice tracker that allows musicians to log their progress through freeform, unstructured reflection. By converting conversational diary entries into structured quantitative data the app lets users see a visual overview of their history while getting personalized recommendations on what to work on next.

https://motif-music.vercel.app

> Demo mode prevents creating or altering sessions but parsing is fully functional.

<img width="1196" height="677" alt="image" src="https://github.com/user-attachments/assets/865f0b23-0305-4a27-a3ad-3f857ea0cd1f" />

## How it works

You write a practice session the way you'd jot it in a notebook, "worked on ii-V-I voicings for 40 min, then ran Giant Steps changes, felt shaky on the bridge." An LLM parses that into structured entries: instrument, focus areas (techniques, genres, etc.), duration, and a rating, along with the date it happened. You review and edit the parsed entries before saving, so any model mistakes can be corrected if needed.

The parsing uses structured output rather than free-text scraping, so the model returns data already shaped to the app's schema validated with Zod before it's shown to you.

## Built with

Next.js (App Router) · React · TypeScript · TanStack Query · Tailwind · Drizzle + Neon (Postgres) · Vercel AI SDK (Claude Haiku) · Zod · Redis
