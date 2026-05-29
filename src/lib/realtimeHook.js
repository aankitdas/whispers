import { useEffect } from 'react'
import { supabase } from './supabase'

export function useWhisperListener(onNewWhisper, target = 'her') {
  useEffect(() => {
    const channel = supabase
      .channel(`whispers-realtime-${target}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'whispers', filter: `target=eq.${target}` },
        (payload) => {
          if (payload.new) onNewWhisper(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [target])
}