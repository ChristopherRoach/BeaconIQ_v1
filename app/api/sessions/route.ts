import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function generateSessionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function GET(request: NextRequest) {
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

    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select(`
        *,
        quizzes (
          title,
          description
        )
      `)
      .eq('host_id', user.id)
      .order('created_at', { ascending: false })

    if (sessionsError) {
      return NextResponse.json({ error: sessionsError.message }, { status: 400 })
    }

    return NextResponse.json({ sessions }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { quiz_id } = await request.json()

    // Generate unique session code
    let sessionCode = generateSessionCode()
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from('quiz_sessions')
        .select('session_code')
        .eq('session_code', sessionCode)
        .single()

      if (!existing) {
        isUnique = true
      } else {
        sessionCode = generateSessionCode()
        attempts++
      }
    }

    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert([{
        quiz_id,
        host_id: user.id,
        session_code: sessionCode,
        status: 'waiting'
      }])
      .select()
      .single()

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 400 })
    }

    return NextResponse.json({ session }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
