# Unwind

A web application designed to provide a quiet, distraction-free environment for writing. 

## Overview
Unwind allows users to select a mood, which sets the background image and starts an ambient music track. Users can type freely in an immersive, full-screen interface. When they are finished writing, they can initiate a "release" sequence. This sequence automatically deletes the text they wrote and displays a randomly selected, comforting quote tailored to their current mood.

## Project Structure
- `src/views/`: Contains the main application screens (`HomeLandingPage` as the root entry, `LandingPage` for the catalog, and `WritePage` for the writing interface).
- `src/data/moods.js`: Configuration for moods, including background images, music tracks, and arrays of quote responses.
- `src/styles/`: Global CSS, design tokens, and typography (utilizing Sackers Gothic Medium, Outfit, and Inter).
- `src/stores/`: Pinia state management for tracking the active mood across the application.

## Tech Stack
- **Framework:** Vue 3 (Vite)
- **State Management:** Pinia
- **Routing:** Vue Router
- **Forms:** Formspree (for mood requests in the footer)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```
