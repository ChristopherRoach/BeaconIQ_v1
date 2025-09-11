import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { participant_name, participant_data } = await request.json()

    if (!participant_name) {
      return NextResponse.json({ error: 'Participant name is required' }, { status: 400 })
    }

    // Find session by code
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('session_code', params.code.toUpperCase())
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Invalid session code' }, { status: 404 })
    }

    if (session.status === 'completed') {
      return NextResponse.json({ error: 'Quiz session has ended' }, { status: 400 })
    }

    // Check if participant with same name already exists in this session
    const { data: existingParticipant } = await supabase
      .from('participants')
      .select('id')
      .eq('session_id', session.id)
      .eq('participant_name', participant_name)
      .single()

    if (existingParticipant) {
      return NextResponse.json({ error: 'A participant with this name already exists' }, { status: 400 })
    }

    // Add participant to session
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .insert([{
        session_id: session.id,
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
