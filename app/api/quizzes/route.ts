import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })

    if (quizzesError) {
      return NextResponse.json({ error: quizzesError.message }, { status: 400 })
    }

    return NextResponse.json({ quizzes }, { status: 200 })

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

    const { title, description, settings, student_info_fields } = await request.json()

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([{
        title,
        description,
        creator_id: user.id,
        settings: settings || {},
        student_info_fields: student_info_fields || {}
      }])
      .select()
      .single()

    if (quizError) {
      return NextResponse.json({ error: quizError.message }, { status: 400 })
    }

    return NextResponse.json({ quiz }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
