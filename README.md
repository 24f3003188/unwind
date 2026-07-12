# Unwind

A cinematic, interactive web application to help you write down your thoughts and let them go. Unwind offers a deeply immersive experience, blending evocative music, beautiful imagery, and a distraction-free writing interface.

## Features

- **Mood Selection**: Choose from 4 unique moods (Heavy, Anxious, Melancholic, Overwhelmed) to set the tone.
- **Dynamic Playlists**: Each mood features a curated 3-song playlist. When a song finishes, the app seamlessly transitions to the next track and background image without interrupting your writing or replay.
- **Cinematic Writing Experience**: Write your thoughts in an immersive, distraction-free environment with fading imagery and music.
- **Private Memories**: Sign in with Google to save your thoughts permanently to your own private memory gallery.
- **Memory Replay**: Re-experience your past thoughts with the exact song and imagery you were listening to when you wrote them. The text types out algorithmically to match the pacing of the track.
- **Let it Go**: If you don't want to keep a memory, choose to release it. Watch it burn, float away, dissolve, or grow into a plant.

## Tech Stack

- **Framework**: Vue 3 with Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Authentication & Database**: Supabase
- **Styling**: Vanilla CSS with CSS Variables (Netflix-inspired design system)

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**
   Rename `.env.example` to `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```

## Database Schema

You will need a `memories` table in Supabase with the following schema:
- `id` (uuid, primary key)
- `created_at` (timestamp with time zone)
- `user_id` (uuid, references auth.users)
- `mood_id` (text)
- `text_content` (text)

Make sure to enable Row Level Security (RLS) on the `memories` table so that users can only read and write their own data.
