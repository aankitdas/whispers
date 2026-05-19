import { useEffect } from 'react'
import { supabase } from './supabase'

/**
 * Subscribe to real-time new whispers from Supabase.
 * Calls onNewWhisper(whisper) whenever a new row is inserted.
 */
export function useWhisperListener(onNewWhisper) {
  useEffect(() => {
    const channel = supabase
      .channel('whispers-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'whispers' },
        (payload) => {
          if (payload.new) onNewWhisper(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onNewWhisper])
}
