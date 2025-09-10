import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Real-time subscription helper with error handling
export const subscribeToTable = (
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void,
  filter?: string
) => {
  return supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table as string,
        filter: filter
      },
      callback
    )
    .subscribe()
}

// Real-time quiz session subscription
export const subscribeToQuizSession = (
  sessionId: string,
  onSessionUpdate: (session: any) => void,
  onParticipantUpdate: (participant: any) => void
) => {
  const channel = supabase
    .channel(`realtime:quiz_session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quiz_sessions',
        filter: `id=eq.${sessionId}`
      },
      (payload) => {
        console.log('Session update:', payload)
        onSessionUpdate(payload.new || payload.old)
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        console.log('Participant update:', payload)
        onParticipantUpdate(payload)
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status)
    })

  return channel
}

// Real-time participant responses subscription
export const subscribeToParticipantResponses = (
  participantId: string,
  onResponseUpdate: (response: any) => void
) => {
  const channel = supabase
    .channel(`realtime:responses:${participantId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'responses',
        filter: `participant_id=eq.${participantId}`
      },
      (payload) => {
        console.log('Response update:', payload)
        onResponseUpdate(payload.new || payload.old)
      }
    )
    .subscribe((status) => {
      console.log('Response subscription status:', status)
    })

  return channel
}

// Clean up channel subscription
export const unsubscribeChannel = (channel: any) => {
  if (channel) {
    supabase.removeChannel(channel)
  }
}

// Settings for realtime fallback
export const realtimeSettings = {
  use_realtime: true, // Can be toggled for fallback testing
  polling_interval: 2000, // Fallback polling interval
  max_retries: 3, // Max reconnection attempts
}
