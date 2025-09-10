import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { action, current_question_index } = await request.json()

    // Verify user owns this session
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', params.id)
      .eq('host_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 })
    }

    let updateData: any = {}

    switch (action) {
      case 'start':
        if (session.status !== 'waiting') {
          return NextResponse.json({ error: 'Session cannot be started' }, { status: 400 })
        }
        updateData = {
          status: 'active',
          started_at: new Date().toISOString()
        }
        break

      case 'pause':
        if (session.status !== 'active') {
          return NextResponse.json({ error: 'Session is not active' }, { status: 400 })
        }
        updateData = { status: 'paused' }
        break

      case 'resume':
        if (session.status !== 'paused') {
          return NextResponse.json({ error: 'Session is not paused' }, { status: 400 })
        }
        updateData = { status: 'active' }
        break

      case 'next_question':
        if (session.status !== 'active') {
          return NextResponse.json({ error: 'Session is not active' }, { status: 400 })
        }
        updateData = {
          current_question_index: current_question_index || ((session.current_question_index || 0) + 1)
        }
          break

      case 'complete':
        updateData = {
          status: 'completed',
          ended_at: new Date().toISOString()
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { data: updatedSession, error: updateError } = await supabase
      .from('quiz_sessions')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ session: updatedSession }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
