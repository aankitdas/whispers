import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      senderAuthenticated: false,
      receiverAuthenticated: false,
      setSenderAuthenticated: (val) => set({ senderAuthenticated: val }),
      setReceiverAuthenticated: (val) => set({ receiverAuthenticated: val }),

      // Whispers data
      whispers: [],
      setWhispers: (whispers) => set({ whispers }),
      addWhisper: (whisper) => set((state) => ({ whispers: [whisper, ...state.whispers] })),

      // Unread count (receiver side)
      unreadCount: 0,
      setUnreadCount: (n) => set({ unreadCount: n }),
      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

      // New whisper notification (receiver)
      incomingWhisper: null,
      setIncomingWhisper: (whisper) => set({ incomingWhisper: whisper }),
      clearIncomingWhisper: () => set({ incomingWhisper: null }),

      // Selected whisper for detail view
      selectedWhisper: null,
      setSelectedWhisper: (whisper) => set({ selectedWhisper: whisper }),

      // Streak
      streak: 0,
      setStreak: (n) => set({ streak: n }),
    }),
    {
      name: 'whispers-auth',
      // Only persist auth flags — not whispers data (always fresh from Supabase)
      partialState: (state) => ({
        senderAuthenticated: state.senderAuthenticated,
        receiverAuthenticated: state.receiverAuthenticated,
      }),
    }
  )
)