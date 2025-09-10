import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('joined_at', { ascending: true })

    if (participantsError) {
      return NextResponse.json({ error: participantsError.message }, { status: 400 })
    }

    return NextResponse.json({ participants }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session_id, participant_name, participant_data } = await request.json()

    if (!session_id || !participant_name) {
      return NextResponse.json({ 
        error: 'Session ID and participant name are required' 
      }, { status: 400 })
    }

    // Verify session exists and is not completed
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('status')
      .eq('id', session_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 404 })
    }

    if (session.status === 'completed') {
      return NextResponse.json({ error: 'Session has ended' }, { status: 400 })
    }

    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert([{
        session_id,
        participant_name,
        participant_data: participant_data || {},
        status: 'connected'
      }])
      .select()
      .single()

    if (participantError) {
      return NextResponse.json({ error: participantError.message }, { status: 400 })
    }

    return NextResponse.json({ participant }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
