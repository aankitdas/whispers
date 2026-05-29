# DECISIONS.md
> Every significant choice made during this project lives here. When in doubt, check here first.

---

## Project Name
**Whispers** — small moments sent across the distance.

---

## 1. What This App Is (Core Concept)

A one-directional love note app. You (the sender) capture a micro-moment — a thought, a feeling, a reason you love her — and it floats to her side as a soft notification. She sees exactly when you thought of her, what triggered it, and what you felt. Over time, her calendar fills up with dots — proof of all the times you thought of her when she wasn't looking.

**Not a chat app. Not a social app.** A private, asymmetric love language bridge.

---

## 2. Two Sides of the App

| Side | Name | Who | Purpose |
|------|------|-----|---------|
| Sender View | "Your Heart" | You | Capture thoughts quickly, see history |
| Receiver View | "Her Garden" | Her | Receive whispers, view calendar of love |

These are two separate URL paths of the same web app:
- `/send` → your side
- `/her` → her side

Authentication is simple — no social login, just a shared secret passphrase per side (set once in Supabase). This avoids app store complexity entirely.

---

## 3. Tech Stack Decisions

### Frontend: React (Vite)
**Why:** 
- Framer Motion (the Motion library) is React-native and it's the best tool for the smooth, physics-based animations we need
- Component model is clean for the two-view split
- Vite = near-instant dev experience for a beginner
- No Next.js complexity needed yet

**Not raw HTML/CSS** because animation sequencing across multiple components becomes a nightmare to manage manually. React lets us treat animations as state.

### Animation: Framer Motion + GSAP for select effects
- **Framer Motion** for component-level transitions (page loads, card entrances, button interactions, spring physics)
- **GSAP** for orchestrated set-piece animations (the "whisper sending" moment — the thought flying upward like a paper lantern)
- **CSS custom animations** for ambient background effects (floating petals, gentle pulses)
- **No Three.js** for V1 — adds complexity without payoff for this use case. Can add later for a "starfield" background if desired.

### Backend: Supabase (your existing free account)
**Why it works perfectly:**
- Free tier: 500MB DB, 200 realtime connections, 2M messages/month — more than enough for 2 users forever
- **Realtime subscriptions** = her side gets the whisper notification live without polling
- Built-in auth for the simple passphrase login
- Postgres = structured storage for whispers (timestamp, location, trigger, message)
- **Critical:** Free projects pause after 7 days of inactivity. We'll add a simple keep-alive ping or just accept that if you haven't used it in a week, it wakes up on next use (takes ~30 seconds)

### Notifications: Supabase Realtime (not push notifications)
**Decision:** We will NOT use OS-level push notifications (PWA service workers) for V1.
**Why:** 
- Requires HTTPS + service worker setup = complexity
- She needs to have the app open (or as a pinned tab) to receive
- This is actually fine for the use case — she can keep it open while doing things
- **V2** can add Web Push API with a service worker

### Hosting: Vercel (free)
- Connect GitHub repo → auto-deploys on every push
- Free tier is perfect for this
- Custom domain optional (could be something like `whispers.love` or just `your-name-to-her-name.vercel.app`)

### State Management: Zustand (lightweight)
- No Redux complexity
- Simple store for: current user side, whisper draft state, loaded whispers

---

## 4. Database Schema

```sql
-- whispers table
create table whispers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  sent_at timestamptz default now(),        -- actual moment of capture
  trigger text,                              -- "a flower reminded me of your smile"
  message text not null,                     -- the actual whisper
  mood text,                                 -- emoji or mood tag: 'tender', 'playful', 'missing you', 'proud'
  location_name text,                        -- "coffee shop on 5th", "the park", etc. (manual, not GPS)
  is_read boolean default false,
  sender_id text default 'you'               -- for future multi-sender support
);

-- Row Level Security: only authenticated users can read/write
```
-- Added in Session 4:
image_url text  -- public URL to Supabase Storage image (optional)

---

## 5. UI/Aesthetic Direction

**Aesthetic:** Soft romantic minimalism with organic motion — think pressed flowers, warm candlelight, Japanese washi paper. NOT millennial pink, NOT generic gradient purple.

**Color Palette:**
```
--cream: #FAF6F0         (background — warm white, like old paper)
--blush: #E8C4B8         (accent — dusty rose, not hot pink)
--sage: #A8B5A0          (secondary accent — muted green, like dried herbs)
--charcoal: #2C2C2C      (text — near black, not harsh)
--gold: #C9A84C          (highlight — warm antique gold)
--fog: rgba(250,246,240,0.85)  (frosted glass overlays)
```

**Typography:**
- Display font: `Cormorant Garamond` (Google Fonts) — romantic, literary, timeless
- Body font: `DM Sans` — modern, clean, readable
- Accent/labels: `Cormorant Garamond Italic`

**Motion Language:**
- Everything floats gently — nothing snaps or slides harshly
- Spring physics on interactive elements
- Whispers "bloom" into view like opening a letter
- The send action: thought rises like steam or a paper lantern
- Background: very subtle floating particle effect (CSS, no JS library needed)

**Key Screens:**
1. **Sender Home** — Clean compose area, today's whispers count, quick-send button
2. **Compose Whisper** — Trigger field + message field + mood selector + location (optional) → Send
3. **Sender History** — Scroll of past whispers by date
4. **Receiver Home (Her Garden)** — Latest whisper displayed beautifully, unread count
5. **Calendar View** — Month grid, each day with whisper dots, tap to expand
6. **Whisper Detail** — Full whisper displayed like an opened letter

---

## 6. Project Structure

```
whispers/
├── src/
│   ├── components/
│   │   ├── sender/
│   │   │   ├── ComposeWhisper.jsx
│   │   │   ├── SenderHome.jsx
│   │   │   └── SenderHistory.jsx
│   │   ├── receiver/
│   │   │   ├── ReceiverHome.jsx
│   │   │   ├── WhisperCalendar.jsx
│   │   │   └── WhisperDetail.jsx
│   │   └── shared/
│   │       ├── WhisperCard.jsx
│   │       ├── MoodSelector.jsx
│   │       ├── AnimatedBackground.jsx
│   │       └── LoadingPetal.jsx
│   ├── lib/
│   │   ├── supabase.js          (client init)
│   │   └── realtimeHook.js      (useWhisperListener)
│   ├── store/
│   │   └── useStore.js          (Zustand)
│   ├── pages/
│   │   ├── SendPage.jsx
│   │   └── HerPage.jsx
│   └── App.jsx
├── DECISIONS.md
├── PROGRESS.md
└── package.json
```

---

## 7. Things Deliberately Deferred to V2

- OS push notifications (Web Push API + service worker)
- GPS/automatic location
- Receiver can "react" to a whisper (heart, etc.)
- Voice whispers (audio recording)
- Custom animated assets (Lottie flowers, hand-drawn illustrations)
- Custom domain
- Mobile app wrapper (Capacitor or React Native)
- [x] OS push notifications — still deferred but PWA groundwork next
- [ ] Image deletion (currently images persist in storage forever)
- [ ] Supabase keep-alive ping to prevent free tier pause
---

## 8. Decisions Locked

- [x] Her name: **Jennifer Lane** (Jen) — UI says "for Jen" / "Aankit thought of you"
- [x] Login: **4-digit PIN** on /her route. Your side (/send) also PIN-protected.
- [x] Calendar: **All days shown** — empty days are visible but unclickable/greyed out
- [x] Streak counter: **Yes** — displayed on sender side
- [x] Notification UX: When she receives a whisper, a **floating banner** animates in:
      "Aankit thought of you ✦" — tap it to open the full whisper (blooms open like a letter)

## 9. Notification Flow (Receiver Side Detail)

1. Supabase Realtime fires → new whisper received
2. Floating toast-style banner drifts in from top: *"Aankit thought of you ✦"*
3. Banner has soft pulse animation, waits for tap
4. Tap → full-screen "letter open" animation → whisper content revealed
5. Mark as read in DB on open
6. Unread count badge on calendar icon

## 10. Additional Decisions (Session 3-4)

- Auth persists via Zustand `persist` middleware → localStorage (auth flags only, not whisper data)
- Branch strategy: `dev` for all work, `main` = production only, Vercel deploys both
- Image uploads: compressed client-side via Canvas API (max 1200px, 0.75 quality) before Supabase Storage upload
- Image UX: expands within WhisperDetail card (Option B), text fades to 12% opacity when expanded
- Custom moods: stored as "{emoji} {text}" string, parsed on render — no DB schema change needed
- Vercel Web Analytics enabled (free tier)