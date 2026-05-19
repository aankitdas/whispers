# PROGRESS.md
> Current status, what's done, what's next. Updated every session.

---

## 🟡 Current Phase: PLANNING

**Last updated:** Session 1
**Current focus:** Architecture decisions + UI research

---

## ✅ Done

- [x] Concept defined and validated
- [x] Tech stack selected and justified
- [x] Database schema designed
- [x] Aesthetic direction locked
- [x] Project folder structure planned
- [x] DECISIONS.md written, PROGRESS.md written
- [x] All open questions answered (Jen, PIN, calendar, streak, notification UX)
- [x] **Phase 1.1 COMPLETE** — Vite + React scaffold, all deps installed
- [x] **Phase 1.2 COMPLETE** — Full design system (CSS variables, typography, components)
- [x] **Phase 1.3 COMPLETE** — All source files written, clean production build ✓
  - `src/lib/supabase.js` — Supabase client
  - `src/lib/realtimeHook.js` — useWhisperListener
  - `src/store/useStore.js` — Zustand store
  - `src/components/shared/` — AnimatedBackground, PinScreen, WhisperCard, MoodSelector
  - `src/components/sender/` — SenderHome, ComposeWhisper
  - `src/components/receiver/` — ReceiverHome, WhisperNotification, WhisperDetail, WhisperCalendar
  - `src/pages/` — SendPage, HerPage
  - `supabase-schema.sql` — ready to run
  - `.env.example` — template

---

## 🔄 In Progress — Phase 1.4: Your Setup Steps

---

## 📋 Up Next (Phase 1: Foundation)

### 1.1 Project Scaffold
- [ ] `npm create vite@latest whispers -- --template react`
- [ ] Install dependencies: framer-motion, gsap, @supabase/supabase-js, zustand, react-router-dom
- [ ] Install dev: tailwindcss (for utility layout, NOT for design system)
- [ ] Set up Google Fonts (Cormorant Garamond + DM Sans) in index.html
- [ ] Create CSS variables file with full color/type system
- [ ] Create folder structure per DECISIONS.md

### 1.2 Supabase Setup
- [ ] Create new Supabase project ("whispers")
- [ ] Run schema SQL (whispers table)
- [ ] Enable Row Level Security
- [ ] Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- [ ] Test connection

### 1.3 Routing
- [ ] Set up React Router v6
- [ ] /send → SenderHome
- [ ] /her → ReceiverHome
- [ ] / → Redirect based on last used side (localStorage)

---

## 📋 Phase 2: Core Functionality

### 2.1 Sender Side
- [ ] ComposeWhisper form (trigger + message + mood + optional location)
- [ ] Form validation (message required, trigger optional)
- [ ] Submit to Supabase
- [ ] SenderHome with compose button + today's count
- [ ] SenderHistory list view

### 2.2 Receiver Side
- [ ] ReceiverHome with latest whisper display
- [ ] Realtime subscription (useWhisperListener hook)
- [ ] "New whisper" animated notification
- [ ] Mark as read on view

### 2.3 Calendar
- [ ] WhisperCalendar month grid
- [ ] Dot indicators per day
- [ ] Tap day → expand whisper list
- [ ] WhisperDetail "open letter" view

---

## 📋 Phase 3: Polish & Animations

### 3.1 Animation Set-Pieces
- [ ] Page load entrance animations (Framer Motion)
- [ ] ComposeWhisper → "send" animation (GSAP — thought rising like a lantern)
- [ ] WhisperCard bloom animation on mount
- [ ] ReceiverHome notification entrance
- [ ] Calendar day hover + expand animations

### 3.2 Ambient Effects
- [ ] Floating particle/petal background (CSS keyframes)
- [ ] Subtle texture overlay on cream background
- [ ] Smooth page transitions between routes

### 3.3 Mobile Responsiveness
- [ ] All views work on phone (primary use case)
- [ ] Touch-friendly tap targets
- [ ] Safe area insets for iOS

---

## 📋 Phase 4: Deployment & Handoff

- [ ] Vercel project setup
- [ ] Environment variables in Vercel
- [ ] Custom 404 handling (SPA routing)
- [ ] Share /her link with her
- [ ] Test end-to-end on two real devices

---

## 🐛 Known Issues / Blockers

*None yet — project just started*

---

## 💡 Ideas Parking Lot (don't implement yet)

- A "letter seal" animation when sending (wax seal press effect)
- Her side has a "garden" metaphor — each whisper is a flower that blooms
- Streak counter with a small flame icon
- "What made you think of me?" categories with illustrated icons (flower, song, food, laugh, miss you)
- Sound design — a very soft chime when she receives a whisper

---

## 📝 Session Notes

### Session 1
- Full ideation + planning complete
- Research done on animation libraries, Supabase limits
- Stack finalized: React/Vite + Framer Motion + GSAP + Supabase + Vercel
- Waiting on answers to open questions before scaffolding

