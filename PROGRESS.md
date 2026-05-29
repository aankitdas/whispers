# PROGRESS.md
> Current status, what's done, what's next. Updated every session.

---

## 🟢 Current Phase: LIVE — Phase 4 Polish ongoing

**Last updated:** Session 4
**Live URL:** whisper-one-flame.vercel.app

---

## ✅ Done

- [x] Concept defined and validated
- [x] Tech stack selected and justified
- [x] Database schema designed
- [x] Aesthetic direction locked
- [x] Project folder structure planned
- [x] DECISIONS.md written, PROGRESS.md written
- [x] All open questions answered (Jen, PIN, calendar, streak, notification UX)
- [x] **Phase 1 COMPLETE** — Full app scaffolded, all components written, clean build
- [x] **Phase 2 COMPLETE** — Supabase schema deployed, realtime confirmed working
- [x] **Phase 3 COMPLETE** — Hosted on Vercel (whisper-one-flame.vercel.app)
- [x] **SMOKE TEST PASSED ✦** — Realtime whisper sent phone → laptop, notification fired instantly
- [x] **Phase 4 Polish (Session 2):**
  - [x] PIN screen fixed for desktop layout
  - [x] Stats row spacing fixed (flex-wrap, proper margin)
  - [x] Compose CTA card cleaned up (removed fake input, centered label)
  - [x] Mood selector — added 3 new presets (in awe, silly, lucky), moved "missing you" to top
  - [x] Mood selector — custom mood with emoji picker via "+" button
  - [x] Receiver side — envelope overlay UX (blurred background, single card, tap to open)
  - [x] Receiver side — unread/read separation (envelope overlay vs whispers bucket)
  - [x] Receiver side — notification banner auto-dismisses after 4s
  - [x] Receiver side — envelope only shows on latest tab, not calendar
  - [x] Receiver side — is_read properly persists to Supabase on open
  - [x] WhisperDetail — mood emoji + label shows correctly for presets and custom moods
  - [x] Image upload — compress + upload to Supabase Storage, shows in WhisperDetail
  - [x] Supabase Storage bucket created (whisper-images, public)
  - [x] image_url column added to whispers table
  - [x] Fern favicon (PNG) added
  - [x] Desktop font size bump via media query
- [x] **Phase 4 Polish (Session 3):**
  - [x] Auth persists across refresh (Zustand persist middleware, localStorage)
  - [x] dev/main branch workflow set up — prod only updates on merge
  - [x] Envelope overlay — × button to dismiss without opening
  - [x] Envelope overlay — OPEN button separated from card click
  - [x] Envelope overlay — body scroll locked when overlay is showing
  - [x] WhisperDetail — body scroll locked when card is open
  - [x] WhisperDetail — card scrolls internally, scrollbar clipped within border radius
  - [x] WhisperDetail — × button top right for easy mobile close
- [x] **Phase 4 Polish (Session 4):**
  - [x] Image expand/collapse in WhisperDetail (Option B — expands within card)
  - [x] Text fades to 12% opacity when image is expanded
  - [x] "tap to expand" / × hint overlays on image
  - [x] Custom mood emoji shows correctly in WhisperCard compact view
  - [x] Custom mood live update — chip updates as you type, no confirm step needed
  - [x] ✦ confirm button removed from mood adder (redundant)
  - [x] Grammarly conflict fixed on custom mood input
  - [x] Vercel Web Analytics added via Vercel Agent
  - [x] Favourites feature — hold-to-fill heart, sparkle animation, Garden tab
- [x] Garden tab — third tab on receiver side, filters favourited whispers  
- [x] Zustand persist bug fixed (partialState → partialize)
- [x] FavouriteHeart hidden on sender side via showFavourite prop

---

## 🔄 Deferred / Up Next

### Phase 4 remaining
- [ ] PWA setup — service worker, manifest, home screen install
- [ ] Web Push notifications — so she gets notified even with tab closed
- [ ] Multiple unread whispers — let her page through them one by one
- [ ] Mobile safe area insets (iOS notch/home bar)

### Phase 5: Nice to haves
- [ ] Sound design — soft chime on whisper receipt
- [ ] Wax seal / letter seal animation on send
- [ ] Custom domain (whispers.love or similar)
- [ ] "What made you think of me?" illustrated category icons

---

## 🐛 Known Issues

- Supabase free tier pauses after 7 days inactivity (~30s wake-up on first load)
- No push notifications yet — she needs tab open to receive in real time

---

## 💡 Ideas Parking Lot

- Sound design — a very soft chime when she receives a whisper
- Wax seal press animation on send
- Streak milestone celebrations (7 days, 30 days)
- "Garden" view — each whisper is a flower that blooms on a canvas

---

## 📝 Session Notes

### Session 1
- Full ideation + planning complete
- Stack finalized: React/Vite + Framer Motion + GSAP + Supabase + Vercel
- All open questions answered

### Session 2
- Full app built, deployed, smoke tested
- Realtime confirmed working across devices
- Major UX polish: envelope overlay, read/unread logic, custom moods, image upload
- Favicon added
- Push notifications deferred to next session

### Session 3
- Auth persistence fixed (survives refresh)
- dev/main branch workflow established
- Mobile scroll fixes: body lock, internal card scroll, scrollbar clipped to border radius
- Envelope and WhisperDetail both have × close buttons
- Envelope OPEN button separated from card tap

### Session 4
- Image expand/collapse within card (Option B)
- Custom mood fixes: emoji in compact card, live update while typing, removed confirm button
- Vercel Web Analytics enabled
- All changes merged to main and live