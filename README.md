<p align="center">
  <img src="./public/whisper-banner.svg" alt="Whispers Banner" width="800" />
</p>

<p align="center">
  <a href="#-concept">Concept</a> • 
  <a href="#-two-halves-of-a-whole">The Two Halves</a> • 
  <a href="#-enchanted-features">Features</a> • 
  <a href="#-magical-setup">Setup Guide</a> • 
  <a href="#-design-aesthetic">Aesthetic</a>
</p>

---

> *"A thought of you, captured in a quiet moment, floating across the digital ether to bloom on your screen."* 🌸

**Whispers** is a private, asymmetric love-bridge built for a party of two. It isn't a loud chat app or another crowded social space. It is a quiet, dedicated digital haven where you can send gentle thoughts, reasons you love your partner, and sweet reminders as they happen. 

Every time she is on your mind, you blow a whisper into the breeze. On her side, it manifests as a soft ambient notification, gradually filling her calendar with glowing dots—a tangible, lasting proof of all the times you thought of her when she wasn't looking. 🧸✨

---

## 🧸 Concept

Most communication tools are made for active, two-way exchanges. **Whispers** is designed for *passive warmth*. 

It captures the micro-moments:
1. **The Spark:** You see a flower, hear a song, or remember a laugh.
2. **The Capture:** You quickly jot down the trigger, the message, and choose your current mood.
3. **The Flight:** The whisper rises like a paper lantern and flies away.
4. **The Bloom:** Her phone/screen lights up gently in real-time. Over time, her virtual garden calendar fills up with beautiful dots, making every day spent together (or apart) feel warm.

---

## 🌸 Two Halves of a Whole

Whispers is split into two distinct spaces, accessible through custom URLs:

| Path | Space | Intended For | Purpose |
|:---:| :--- | :--- | :--- |
| **`/send`** | **`Your Heart`** | **Sender** ✍️ | Capture thoughts quickly, select moods (tender, playful, missing you, proud), write what triggered it, and keep track of your daily sending streak! |
| **`/her`** | **`Her Garden`** | **Receiver** 🏡 | Receive instant realtime whispers, view the interactive monthly calendar, open letters in full screen, and count the dots of affection. |

*Both portals are locked with a secure **4-digit PIN** to keep your garden strictly private and safe.* 🔒

---

## ✦ Enchanted Features

*   **Realtime Whispering:** Built with Supabase Realtime—new thoughts appear on the receiver's side the exact second they are sent without needing a page refresh! ⚡
*   **Whimsical Mood Selector:** Choose the tone of your whisper—whether it's a *tender* thought, a *playful* tease, a *missing you* sigh, or a *proud* cheer. 🎨
*   **The Whispers Calendar:** A clean, minimal monthly grid where every whisper is stored as a soft rose or gold dot. The receiver can click on any day to open the letters and read them again. 📅
*   **Daily Streaks:** A warm little badge on your side to keep track of consecutive days of thinking of her. 
*   **Ambient Physics:** High-fidelity, organic animations powered by **Framer Motion** + **GSAP**. Watch letters "bloom" open like a wax-sealed parchment, and see background petals drift by dynamically. 🍃

---

## 🛠️ Magical Setup

Want to run this digital garden locally or host it? Follow these simple steps:

### 1. Requirements 📦
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Plant the Seeds (Install Dependencies) 🌱
Clone the project, open your terminal in the directory, and run:
```bash
npm install
```

### 3. Establish the Soil (Database Setup) 🪨
1. Create a free project on [Supabase](https://supabase.com/).
2. Head to the **SQL Editor** in your Supabase dashboard.
3. Copy the SQL schema from `supabase-schema.sql` and run it to create the `whispers` table, set up indexes, and enable real-time messaging.
4. Enable Row Level Security (RLS) if you want extra lock-and-key security!

### 4. Whispering in the Wind (Environment Configuration) 🤫
Create a file named `.env` in the root of the project (use `.env.example` as a starting point) and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anonymous-api-key
```
*(Don't worry, `.env` is already added to `.gitignore` so your secrets stay safe!)*

### 5. Cultivate (Start Dev Server) 🚀
Run the developer command to launch the app:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🎨 Design Aesthetic

The app is styled with **Warm Romantic Minimalism**, inspired by pressed botanical journals, hand-poured candles, and Japanese washi paper. 

*   **Background:** Warm antique cream (`#FAF6F0`) with a very fine paper noise texture.
*   **Accent:** Dusty rose blush (`#E8C4B8`) and muted sage green (`#A8B5A0`).
*   **Glow:** Antique gold highlights (`#C9A84C`).
*   **Typography:** The literary, elegant *Cormorant Garamond* for titles, paired with the modern, readable *DM Sans* for body text.

---

<p align="center">
  Made with tons of care, love, and a pinch of magic. ✨
</p>
